
import Link from "next/link";
import Image from 'next/image';

export default function FloatingActionButton(props: any) {

    return (
        <Link
            href={props.href}
            style={{
                position: "absolute",
                bottom: 15,
                right: 15,
                width: 60,
                height: 60,
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
            }}
            onClick={props.onClick}
        >
            <Image color="white" width={30} height={30} src={`/${props.icon}`} alt="crop" />
        </Link>
    )
}