## Follow these steps to stream a video in loop using Java code:

1. First install IntelliJ IDEA, Community Edition: https://www.jetbrains.com/idea/download/#section=windows

2. Launch IntelliJ IDEA. If the Welcome screen opens, click Open. Otherwise, from the main menu, select File -> Select AIDA_KVS project -> Click OPEN.

3. From the main menu, select File -> Project Structure Ctrl+Alt+Shift+S. Under Project Settings, select Modules -> Dependencies -> Click Module SDK DropDown -> Select Add SDK -> Download JDK -> Select version: 20 and vendor: Oracle OpenJDK-20.

4. Now In Dependencies Click on "+" Icon -> Library -> From Maven -> Search and select: com.amazonaws:aws-java-sdk-core:1.12.437 -> OK

5. Again Click on "+" Icon -> Library -> From Maven -> Search and select: com.amazonaws:aws-java-sdk-kinesisvideo:1.11.1030 -> OK

6. Again Click on "+" Icon -> Library -> From Maven -> Search and select: com.amazonaws:amazon-kinesis-video-streams-producer-sdk-java:1.8.0 -> OK

7. Now goto src folder in AIDA_KVS directory -> Main -> Add your stream name and region.

8. From the main menu, select Build -> Build Project.

9. From the main menu, select Run -> Run Main.java(Recommended to open Main.java and then Run Main.Java).