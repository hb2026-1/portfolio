import { useLocation } from "react-router-dom";
import "./addemail/changeappoi.css";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import ReactLoading from "react-loading";
import Alerteaddemail from "./button/alerteaddemail";
import toast from "react-hot-toast";
const regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const Addemail = () => {
  const { setshowmessageSignin, showmessageaddemail } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailup, setemailup] = useState("");
  const [verificolorup, setverificolorup] = useState("");

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function submitform() {
    if (emailup!=="") {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/verifyemail", {
          method: "POST",
          body: JSON.stringify({
            email: emailup,
          }),
          headers: { "Content-Type": "application/json" },
        });
        setLoading(false);
        const data = await res.json();
  
        if (data.validatorError) {
          data.validatorError.forEach((item) => {
            if (item.path == "email") {
              setverificolorup("borderRed");
              document.getElementById("errormess").textContent =
                "Email not valid";
              document.getElementById("errormess").style.color = "red";
            }
          });
        }
  
        if (data.notexist) {
          setverificolorup("borderRed");
          document.getElementById("errormess").textContent =
            "Please book an appointment first";
        }
  
        if (data.rdvalreadychanged) {
          setverificolorup("borderRed");
          document.getElementById("errormess").textContent =
            "appointment already changed";
        }
        if (data.moin48) {
          setverificolorup("borderRed");
          document.getElementById("errormess").textContent =
            "It is necessary to change the appointment at least 48 hours in advance";
        }
  
        if (data.message) {
          setemailup("");
          setverificolorup("");
  
          document.getElementById("errormess").textContent = "";
          toast.success(
            "Please check your email. If you don't find it, please check your spam folder.",
            { duration: 8000 }
          );
  
          navigate("/addemail");
          setshowmessageSignin(true);
        }
      } catch (error) {
        setLoading(false);
        document.getElementById("errormess").textContent = error;
      } 
    }else{
      setverificolorup("borderRed");
              document.getElementById("errormess").textContent =
                "Email Required";
              document.getElementById("errormess").style.color = "red";
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
          <p className="title title2">Change your appointment</p>

          <form id="formsignup">
            <div className="user-box">
              <input
                value={emailup}
                onKeyUp={(eo) => {
                  // @ts-ignore
                  if (eo.target.value.length !== 0) {
                    // @ts-ignore
                    if (regEmail.test(eo.target.value)) {
                      setverificolorup("borderGren");
                    } else {
                      setverificolorup("borderRed");
                    }
                  } else {
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
              <p
                id="errormess"
                style={{
                  color: "red",
                  fontSize: "16px",
                  fontWeight: "400",
                  textAlign: "left",
                }}
              ></p>
            </div>

            <div className="divsubmit">
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
            </div>
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
