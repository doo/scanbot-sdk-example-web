import React, {CSSProperties} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class FilterDialog extends React.Component<any, any> {

    get styles() {
        return {
            appBar: {position: 'relative'} as CSSProperties,
            title: {flex: 1}
        }
    }

    render() {
        return (
            // @ts-ignore
            <Dialog fullScreen open={this.props.visible} onClose={this.props.onClose} TransitionComponent={Transition}>
                <AppBar style={this.styles.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.props.onClose} aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" style={this.styles.title}>
                            Filter
                        </Typography>
                        <Button autoFocus color="inherit" onClick={this.props.onClose}>
                            APPLY
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania"/>
                    </ListItem>
                    <Divider/>
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys"/>
                    </ListItem>
                </List>
            </Dialog>
        );
    }

}
