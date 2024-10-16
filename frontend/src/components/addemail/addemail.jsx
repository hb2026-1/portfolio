import { useLocation } from "react-router-dom";
import "./addemail.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";
import ReactLoading from "react-loading";
import Alerteaddemail from "../button/alerteaddemail";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import toast from "react-hot-toast";
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
  const [group, setgroup] = useState("");
  const [secretkey, setsecretkey] = useState("");
  const [submitup, setsubmitup] = useState("");
  const [verificolorup, setverificolorup] = useState("");
  const [verificolor2up, setverificolor2up] = useState("");
  const [verificolor3up, setverificolor3up] = useState("");

  const [verificolorgroup, setverificolorgroup] = useState("");
  const [verificolorsecret, setverificolorsecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://server-portfolio-hb.onrender.com/ping", {
          method: "GET", // Changement de POST à GET
          headers: { "Content-Type": "application/json" },
        });
  
        if (!res.ok) {
          throw new Error('wait ..server in cold start...');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  function pagechangerdv() {
    navigate("/addemail")
  }
  

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
            group:group,
            secretkey:secretkey,
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
              "البريد الإلكتروني أو الإسم خاطئ";
              document.getElementById("errormess").style.color="red"
          }
          if (item.path == "group") {
            setverificolorgroup("borderRed");
            
            document.getElementById("errormess").textContent =
              " رقم الفوج خاطئ";
              document.getElementById("errormess").style.color="red"
          }
        });
      }
      if (data.isCurrentEmail) {
        document.getElementById("errormess").textContent = t("emailexist");
        setverificolorup("borderRed");
        document.getElementById("errormess").style.color="red"
      }
      if (data.isCurrentEmailverify) {
        document.getElementById("errormess").textContent = t("confirmeremail");
        setverificolorup("borderRed");
        document.getElementById("errormess").style.color="red"
      }
      if (data.secretkeyrequired) {
        document.getElementById("errormess").textContent = t("Secret key Required");
        setverificolorsecret("borderRed");
        document.getElementById("errormess").style.color="red"
      }
      if (data.secretkeyinvalid) {
        document.getElementById("errormess").textContent = t("Secret key invalid");
        setverificolorsecret("borderRed");
        document.getElementById("errormess").style.color="red"
      }
      if (data.emptytable) {
        document.getElementById("errormess").textContent = t("No appointments are available");
        document.getElementById("errormess").style.color="red"
      }
      if (data.tomany) {
        document.getElementById("errormess").textContent = t("Too many requests, please try again later");
        document.getElementById("errormess").style.color="orange"
      }
      if (data.id) {
        setemailup("");
        setflname("");
        setverificolorup("");
        setverificolor2up("");
        setsecretkey("");
        setgroup("");
        setverificolorgroup("");
        setverificolorsecret("");
        // setshowmessageaddemail(true);
        document.getElementById("errormess").textContent = "";
        toast.success("يرجى مراجعة بريدك الإلكتروني. إذا لم تجد الرسالة، يرجى التحقق من صندوق البريد المزعج (السبام)", { duration: 8000 });

        navigate("/addemail");
        setshowmessageSignin(true);
        a = 0;
        b = 0;
        c = 0;
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
      document.getElementById("errormess").textContent = error;
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

              <label id="label1">{t("email2")}</label>
            </div>

            <div className="user-box">
              <input
                 onKeyUp={(eo) => {
                  // @ts-ignore
                  if (eo.target.value.length > 5 ) {
                    // @ts-ignore
                    b = 1
                    setverificolor2up("borderGren");
                }else{
                  b = 1
                    setverificolor2up("borderRed");
                }}}
                className={verificolor2up}
                autoComplete="off"
                onChange={(eo) => {
                  setflname(eo.target.value);
                }}
                required
                maxLength={50}
                minLength={6}
                name="flname"
                type="text"
                id="flname"
                value={flname}
              />

              <label id="label2">{t("fullname")}</label>
            </div>

            <div className="user-box">
              <input
                value={group}
                onKeyUp={(eo) => {
                  // @ts-ignore
                  if (eo.target.value.length !== 0) {
                    // @ts-ignore
                    if (group>0) {
                      a = 1;
                      setverificolorgroup("borderGren");
                    } else {
                      a = 0;
                      setverificolorgroup("borderRed");
                    }
                  } else {
                    a = 0;
                    setverificolorgroup("");
                  }
                }}
                className={verificolorgroup}
                autoComplete="off"
                onChange={(eo) => {
                  setgroup(eo.target.value);
                  if (eo.target.value.length !== 0) {
                    // @ts-ignore
                    if (group !== "") {
                      a = 1;
                      setverificolorgroup("borderGren");
                    } else {
                      a = 0;
                      setverificolorgroup("borderRed");
                    }
                  } else {
                    a = 0;
                    setverificolorgroup("");
                  }
                }}
                required
                name="group"
                type="text"
                
                
                id="group"
                
              />

              <label id="label3">{t("Group Number")}</label>
            </div>

            <div className="user-box">
              <input
                 onKeyUp={(eo) => {
                  // @ts-ignore
                  if (eo.target.value.length > 9 ) {
                    // @ts-ignore
                    b = 1
                    setverificolorsecret("borderGren");
                }else{
                  b = 1
                  setverificolorsecret("borderRed");
                }}}
                className={verificolorsecret}
                autoComplete="off"
                onChange={(eo) => {
                  setsecretkey(eo.target.value);
                }}
                required
                maxLength={10}
                minLength={10}
                name="secretkey"
                type="text"
                id="secretkey"
                value={secretkey}
              />

              <label id="label4">{t("Secret Key")}</label>
            </div>

            
            <p
              id="errormess"
              style={{
                color: "red",
                fontSize: "16px",
                fontWeight: "400",
                textAlign: "right",
              }}
            ></p>
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
                    height={"20px"}
                    width={"20px"}
                  />
                </div>
              ) : (
                t("submit2")
              )}
            </a>
            
            <Stack className="stack" direction="row" spacing={2} justifyContent="center" >
      
      <Button onClick={() => {
    navigate("/changeappoi");
  }}  className="btnchange" variant="contained" color="secondary">
      {t("change")}
      </Button>
    </Stack>
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
