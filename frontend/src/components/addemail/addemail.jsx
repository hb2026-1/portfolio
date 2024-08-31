import { useLocation } from "react-router-dom";
import "./addemail.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";
import ReactLoading from "react-loading";
import Alerteaddemail from "../button/alerteaddemail";
const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
let a = 0;
let b = 0;
let c = 0;
const Addemail = () => {
  const { setshowmessageSignin, setshowmessageaddemail, showmessageaddemail } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailup, setemailup] = useState("");
  const [flname, setflname] = useState("");
  const [submitup, setsubmitup] = useState("");
  const [verificolorup, setverificolorup] = useState("");
  const [verificolor2up, setverificolor2up] = useState("");
  const [verificolor3up, setverificolor3up] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (a === 1 && b === 1 && c === 1) {
      setsubmitup("true");
    } else {
      setsubmitup("");
    }
  }, [verificolorup, verificolor2up, verificolor3up]);

  async function submitform() {
    try {
      setLoading(true);
      const res = await fetch(
        "https://server-portfolio-hb.onrender.com/addemail",
        {
          method: "POST",
          body: JSON.stringify({
            email: emailup,
            flname: flname,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      const data = await res.json();
      if (data.validatorError) {
        data.validatorError.forEach((item) => {
          if (item.path == "email" || item.path == "flname") {
            setverificolorup("borderRed");
            setverificolor2up("borderRed");
            document.getElementById("errormess").textContent =
              "Email or Name not valid";
          }
        });
      }
      if (data.isCurrentEmail) {
        document.getElementById("errormess").textContent = t("emailexist");
        setverificolorup("borderRed");
      }
      if (data.id) {
        setemailup("");
        setflname("");
        setverificolorup("");
        setverificolor2up("");
        setshowmessageaddemail(true);
        document.getElementById("errormess").textContent = "";

        navigate("/addemail");
        setshowmessageSignin(true);
        a = 0;
        b = 0;
        c = 0;
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t("Add Email to Simulation")}</title>
        <meta
          name="description"
          content="Inscrivez-vous dès maintenant pour rejoindre le tableau des rendez-vous pour simulation"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.5 }}
        className="login-box2"
      >
        <div className="login-box2">
          <p className="title">{t("simulation")}</p>

          <form id="formsignup">
            <div className="user-box">
              <input
                value={emailup}
                onKeyUp={(eo) => {
                  // @ts-ignore
                  if (eo.target.value.length !== 0) {
                    // @ts-ignore
                    if (regEmail.test(eo.target.value)) {
                      a = 1;
                      setverificolorup("borderGren");
                    } else {
                      a = 0;
                      setverificolorup("borderRed");
                    }
                  } else {
                    a = 0;
                    setverificolorup("");
                  }
                }}
                className={verificolorup}
                autoComplete="off"
                onChange={(eo) => {
                  setemailup(eo.target.value);
                }}
                required
                name="emailup"
                type="text"
                id="emailup"
              />

              <label>{t("email")}</label>
            </div>

            <div className="user-box">
              <input
                onKeyUp={(eo) => {
                  // @ts-ignore
                }}
                className={verificolor2up}
                autoComplete="off"
                onChange={(eo) => {
                  setflname(eo.target.value);
                }}
                required
                maxLength={30}
                minLength={6}
                name="flname"
                type="text"
                id="flname"
                value={flname}
              />

              <label>{t("fullname")}</label>
            </div>
            <p
              id="errormess"
              style={{
                color: "red",
                fontSize: "16px",
                fontWeight: "400",
                textAlign: "left",
              }}
            ></p>

            <a
              className="true"
              onClick={submitform}
              id="spano"
              // href="#"
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              {loading ? (
                <div className="divloader">
                  {" "}
                  <ReactLoading
                    className="loaderconfi"
                    type={"spin"}
                    color={"black"}
                    height={"30px"}
                    width={"30px"}
                  />
                </div>
              ) : (
                t("submit")
              )}
            </a>
          </form>
        </div>

        {showmessageaddemail && (
          <Alerteaddemail text={"Please verify your email"} succ={"info"} />
        )}
      </motion.div>
    </HelmetProvider>
  );
};

export default Addemail;
