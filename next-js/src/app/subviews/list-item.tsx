import Link from "next/link";

export default function ListItem(props: Readonly<any>) {
    return (
        <Link href={props.href}>
            <div style={{ margin: "20px 20px 0 20px", borderBottom: "1px solid lightgray" }}>
                <div style={{ color: "black", fontSize: "18px", fontWeight: "500", paddingBottom: 5 }}>
                    {props.title}
                </div>
                <div style={{ color: "gray", fontSize: "12px", fontWeight: "300", paddingBottom: 12 }}>
                    {props.description}
                </div>
            </div>
        </Link>
    )
}
