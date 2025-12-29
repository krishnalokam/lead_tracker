const Layout = ({ title, children }) => {
  return (
    <div
  style={{
    padding: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "left"   // ✅ force left alignment
  }}
>
      <h1>{title}</h1>
      <hr />
      {children}
    </div>
  );
};

export default Layout;
