import { ListSubheader } from "@mui/material";
import { TextColor } from "./FeatureListItem.tsx";

export class Props {
    title!: string;
    paddingTop?: number = 0;
}

export default function SectionHeader(props: Props) {

    const horizontalPadding = 16;
    return (
        <div style={{ paddingTop: props.paddingTop }}>
            <ListSubheader style={{ backgroundColor: "transparent", color: TextColor, fontSize: 16 }}>
                {props.title}
            </ListSubheader>
            <div style={{
                width: `calc(100% - ${2 * horizontalPadding}px)`,
                height: "1px",
                backgroundColor: "gray",
                marginLeft: horizontalPadding
            }} />
        </div>
    )
}
