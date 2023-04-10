import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.kinesisvideo.*;
import com.amazonaws.services.kinesisvideo.model.*;

import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URI;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.CountDownLatch;

public class Main {
    private static final int FPS_25 = 25;
    private static final String PUT_MEDIA_API = "/putMedia";
    private static final int CONNECTION_TIMEOUT_IN_MILLIS = 100_000;
    private static final int RETENTION_ONE_HOUR = 1;
    private static final String MKV_FILE_PATH = "src/clusters.mkv";
    // CHECKSTYLE:SUPPRESS:LineLength
    // Need to get key frame configured properly so the output can be decoded. h264 files can be decoded using gstreamer plugin
    // gst-launch-1.0 rtspsrc location="YourRtspUri" short-header=TRUE protocols=tcp ! rtph264depay ! decodebin ! videorate ! videoscale ! vtenc_h264_hw allow-frame-reordering=FALSE max-keyframe-interval=25 bitrate=1024 realtime=TRUE ! video/x-h264,stream-format=avc,alignment=au,profile=baseline,width=640,height=480,framerate=1/25 ! multifilesink location=./frame-%03d.h264 index=1
    private static final String IMAGE_FILENAME_FORMAT = "frame-%03d.h264";
    private static final int START_FILE_INDEX = 1;
    private static final int END_FILE_INDEX = 375;
    private static final String STREAM_NAME = "my-stream"; // Add your stream name
    private static final Regions REGION = Regions.US_EAST_1; // Add your region
    private static final int FRAME_RATE = 25;
    private static final int STORAGE_SIZE = 128 * 1024;
    private static final int RETENTION_PERIOD_HOURS = 24;

    public static void main(String[] args) throws Exception {
        // Set up credentials provider and Kinesis Video client
        AWSCredentialsProvider credentialsProvider = DefaultAWSCredentialsProviderChain.getInstance();
        System.out.println("credentialsProvider..."+ credentialsProvider);
        AmazonKinesisVideo kinesisVideoClient = AmazonKinesisVideoClientBuilder.standard()
                .withCredentials(credentialsProvider)
                .withRegion(REGION)
                .build();

        // Create a new Kinesis Video stream
        System.out.println("Creating stream..."+kinesisVideoClient);
        try {
            CreateStreamRequest createStreamRequest = new CreateStreamRequest()
                    .withStreamName(STREAM_NAME)
                    .withDataRetentionInHours(RETENTION_PERIOD_HOURS)
                    .withMediaType("video/mkv")
                    .withTags(Collections.singletonMap("key", "value"));
            CreateStreamResult createStreamResult = kinesisVideoClient.createStream(createStreamRequest);
            String streamARN = createStreamResult.getStreamARN();
            System.out.println("Stream ARN: " + streamARN);
        } catch (ResourceInUseException e){
            DescribeStreamRequest describeStreamRequest = new DescribeStreamRequest()
                    .withStreamName(STREAM_NAME);
//                    .withStreamARN(STREAM_ARN);
            DescribeStreamResult describeStreamResult = kinesisVideoClient.describeStream(describeStreamRequest);
            String streamARN = describeStreamResult.getStreamInfo().getStreamARN();
            System.out.println("Stream ARN: " + streamARN);
            // Stream already exists, so skip creation
            System.out.println("Stream " + STREAM_NAME + " already exists.");
        }

        // Wait for the stream to become active
        System.out.println("Waiting for stream to become active...");
        final AmazonKinesisVideo frontendClient = AmazonKinesisVideoAsyncClient.builder()
                .withCredentials(credentialsProvider)
                .withRegion(REGION)
                .build();

        /* this is the endpoint returned by GetDataEndpoint API */
        final String dataEndpoint = frontendClient.getDataEndpoint(
                new GetDataEndpointRequest()
                        .withStreamName(STREAM_NAME)
                        .withAPIName("PUT_MEDIA")).getDataEndpoint();
        while (true) {
            /* actually URI to send PutMedia request */
            final URI uri = URI.create(dataEndpoint + PUT_MEDIA_API);

            /* input stream for sample MKV file */
            final InputStream inputStream = new FileInputStream(MKV_FILE_PATH);

            /* use a latch for main thread to wait for response to complete */
            final CountDownLatch latch = new CountDownLatch(1);

            /* PutMedia client */
            final AmazonKinesisVideoPutMedia dataClient = AmazonKinesisVideoPutMediaClient.builder()
                    .withRegion(REGION)
                    .withEndpoint(URI.create(dataEndpoint))
                    .withCredentials(credentialsProvider)
                    .withConnectionTimeoutInMillis(CONNECTION_TIMEOUT_IN_MILLIS)
                    .build();

            final PutMediaAckResponseHandler responseHandler = new PutMediaAckResponseHandler()  {
                @Override
                public void onAckEvent(AckEvent event) {
                    System.out.println("onAckEvent " + event);
                }

                @Override
                public void onFailure(Throwable t) {
                    latch.countDown();
                    System.out.println("onFailure: " + t.getMessage());
                    // TODO: Add your failure handling logic here
                }

                @Override
                public void onComplete() {
                    System.out.println("onComplete");
                    latch.countDown();
                }
            };

            /* start streaming video in a background thread */
            dataClient.putMedia(new PutMediaRequest()
                            .withStreamName(STREAM_NAME)
                            .withFragmentTimecodeType(FragmentTimecodeType.RELATIVE)
                            .withPayload(inputStream)
                            .withProducerStartTimestamp(Date.from(Instant.now())),
                    responseHandler);

            /* wait for request/response to complete */
            latch.await();

            /* close the client */
            dataClient.close();
        }
    }
}
