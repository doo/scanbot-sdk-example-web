import { ListSubheader } from "@mui/material";

export class Props {
    title!: string;
}

export default function SectionHeader(props: Props) {

    return (
        <div>
            <ListSubheader style={{ backgroundColor: "transparent", color: "white", fontSize: 18 }}>
                {props.title}
            </ListSubheader>
            <div style={{ width: "90%", height: "1px", backgroundColor: "gray", margin: "auto" }}></div>
        </div >
    )
}
