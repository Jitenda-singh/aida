import { Chip } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ClearIcon from '@mui/icons-material/Clear';
const useStyles = makeStyles((theme) => ({
  userChip: {
    margin: '5px',
    color: theme.palette.primary.text,
    letterSpacing: '-0.27px',
    height: '25px'
  },
}))
export const UserListDisplay = (props) => {
  const classes = useStyles()
  return (
    props.mainContactUserIdsList.map((item, ind) =>
      <span style={{margin: "4px"}}>
        <Chip
          className={`${classes.userChip}`}
          label={item}
          variant="outlined"
          onDelete={(event) => props.onChange('deleteMainContactUserIds', event, ind)}
          deleteIcon={<ClearIcon className={classes.deleteIcon} />}
        />
      </span>
    ))
}
