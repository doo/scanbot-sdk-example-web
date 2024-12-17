import { ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIconTypeMap } from "@mui/material";

import { MouseEventHandler } from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export class Props {
    onClick!: MouseEventHandler<HTMLDivElement>;
    text!: string;
    icon!: OverridableComponent<SvgIconTypeMap> & { muiName: string }
}

export default function FeatureListItem(props: Props) {
    return (
        <ListItem sx={{ width: "100%" }}>
            <ListItemIcon>
                <props.icon style={{ color: "lightgray" }} />
            </ListItemIcon>
            <ListItemButton onClick={props.onClick}>
                <ListItemText style={{ color: "lightgray" }} primary={props.text} />
            </ListItemButton>
        </ListItem>
    );
}
