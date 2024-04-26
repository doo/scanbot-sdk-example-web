
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

class Props {
    text?: string;
    icon?: ReactNode;
    onClick: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function FeatureListItem(props: Props) {

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={props.onClick}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    )
}