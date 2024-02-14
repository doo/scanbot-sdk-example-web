
import Link from "next/link";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ListItem(props: Readonly<any>) {
    return (
        <Link href={props.isLoading ? "/" : props.href}>
            <div style={{ margin: "20px 20px 0 20px", borderBottom: "1px solid lightgray" }}>
                <div style={{ color: "black", fontSize: "18px", fontWeight: "500", paddingBottom: 5 }}>
                    {props.isLoading ? <Skeleton/> : props.title}
                </div>
                <div style={{ color: "gray", fontSize: "12px", fontWeight: "300", paddingBottom: 12 }}>
                    {props.isLoading ? <Skeleton count={2}/> : props.description}
                </div>
            </div>
        </Link>
    )
}
