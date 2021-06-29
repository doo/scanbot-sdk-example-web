import React, {CSSProperties} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DetailedImageFilter from "../model/DetailedImageFilter";
import StringUtils from "../utils/string-utils";

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
            <Dialog fullScreen open={this.props.data.visible} onClose={this.props.onClose} TransitionComponent={Transition}>
                <AppBar style={this.styles.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.props.onClose} aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" style={this.styles.title}>
                            Filter
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => this.props.onApply(this.findSelected())}>
                            APPLY
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    {this.renderFilters()}
                </List>
            </Dialog>
        );
    }

    hasSelectedFilter(): boolean {
        return !!this.findSelected();
    }
    findSelected() {
        const result = this.props.data.filters.find((filter: DetailedImageFilter) => filter.selected);
        return result;
    }

    setActiveFilter(filters: DetailedImageFilter[], currentFilterName: string) {
        filters.forEach((filter: DetailedImageFilter) => {
            if (filter.name === currentFilterName) {
                filter.selected = true;
                return;
            }
        });
    }

    renderFilters() {
        const {filters, currentFilter} = this.props.data;
        if (!filters) {
            return null;
        }

        if (!this.hasSelectedFilter()) {
            if (currentFilter) {
                this.setActiveFilter(filters, currentFilter.name);
            } else {
                this.setActiveFilter(filters, "none")
            }
        }

        return filters.map((filter: DetailedImageFilter) => this.renderFilter(filter));
    }

    renderFilter(filter: DetailedImageFilter) {

        return (
            <ListItem key={filter.name} button selected={filter.selected} onClick={() => {
                this.props.data.filters.forEach((filter: DetailedImageFilter) => {
                    filter.selected = false;
                });
                filter.selected = true;
                this.setState({});
            }}>
                <ListItemText
                    primary={StringUtils.capitalize(filter.name)}
                    secondary={filter.description}
                />
            </ListItem>
        );
    }

}
