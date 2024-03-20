import Header from "../../components/Header/Header";
import "./articles.css";
import Footer from "../../components/Footer/Footer";
import Detail from "../../components/article/detail";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Articles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlapp = location.pathname;
  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <div className="containerarticles">
      <Header url={urlapp} />
      <br />
      <br />
      <div className="divider" />

      <Detail />
      <div className="divider" />
      <Footer />
    </div>
  );
};

export default Articles;
