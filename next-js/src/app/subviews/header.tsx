
export default function Header() {
    return (
        <div style={{
            width: "100%",
            backgroundColor: "#c8193c",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "200",
        }}>
            <div style={{ marginLeft: "-10px", fontWeight: 500 }}>Scanbot</div>
            <div style={{ padding: "0 5px 0 5px" }}> Web</div>
            <div style={{ fontWeight: 500 }}>SDK</div>
        </div>
    )
}