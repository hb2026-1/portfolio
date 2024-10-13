import  { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./changerdv.css";
import ReactLoading from "react-loading";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";

const EditRendezVous = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [validUrl, setValidUrl] = useState(null);
  const [validUrl2, setValidUrl2] = useState("");
  const [afficheerreur, setafficheerreur] = useState("");
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  // useEffect(() => {
  //   const verifyEmailUrl = async () => {
  //     try {
  //       const url = `http://localhost:3000/confirmationchangerdv?token=${token}`;
  //       setLoading(true);
  //       const { data } = await axios.post(url);
  //       setValidUrl(true);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   };
  //   verifyEmailUrl();
  // }, [token]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const url2 = `https://server-portfolio-hb.onrender.com/get?token=${token}`;
        const response = await axios.get(url2);
        

        if (response.data.errortoken === "Token not valid") {
          setLoading(false);
          setValidUrl(false);
        }
        if (response.data.erroralreadychanged) {
          setValidUrl2("dd");
          setValidUrl(null);
        }
        if (response.data.datas === "data is available") {
          setValidUrl(true);
          setAppointments(response.data.promoteurs);
        }
      } catch (error) {
        setLoading(false);
        setValidUrl(false);
      }
    };

    fetchAppointments();
  }, [token]);

  async function handlechangerdv() {
    let selectedDateValue = selectedDate.value;
    let formattedDateValue = selectedDateValue.replace(/\//g, "-");
    let dateParts = formattedDateValue.split("-");
    let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    try {
      setLoading2(true);
      const res = await fetch(
        `https://server-portfolio-hb.onrender.com/confirmationchangerdv?token=${token}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            date: formattedDate,
            hour: selectedTime,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading2(false);
      const data = await res.json();
      if (data.errortoken) {
        setValidUrl(false);
      }
      if (data.erroralreadychanged) {
        setValidUrl2("dd");
        setValidUrl(null);
      }

      if (data.rdvalreadychanged) {
        setValidUrl2("dd");
        setValidUrl(null);
      }
      if (data.rdvchanged) {
        setValidUrl2("bb");
        setValidUrl(null);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  }

  const handleDateChange = (option) => {
    setSelectedDate(option);

    const filteredTimes = appointments
      .filter(
        (appointment) =>
          new Date(appointment.date).toLocaleDateString("fr-FR") ===
          option.value
      )
      .map((appointment) => ({
        value: appointment.time,
        label: appointment.time,
      }));

    setAvailableTimes(filteredTimes);
    setSelectedTime(null); // Réinitialiser l'heure sélectionnée
  };

  const uniqueDates = [
    ...new Set(
      appointments.map((appointment) => {
        const date = new Date(appointment.date);
        return date.toLocaleDateString("fr-FR"); // Format DD/MM/YYYY
      })
    ),
  ].map((date) => ({ value: date, label: date }));

  return (
    <>
      {loading && (
        <Stack
          sx={{ color: "grey.500" }}
          spacing={2}
          direction="row"
          className="loadingemail"
        >
          <CircularProgress color="secondary" size={60} />
        </Stack>
      )}
      {validUrl && (
        <div className="divchangeglobal">
          <div className="div">
            <h2>Modify your appointment</h2>
            <label className="label" htmlFor="date-select">
            Choose a date :
            </label>
            <Select
              className="selectdate"
              id="date-select"
              options={uniqueDates}
              onChange={handleDateChange}
              isDisabled={selectedDate !== null} // Désactiver si une date est sélectionnée
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? "lightgreen"
                    : provided.backgroundColor,
                  color: state.isFocused ? "black" : "black",
                }),
                control: (provided) => ({
                  ...provided,
                  marginBottom: "20px",
                }),
              }}
            />

            <div>
              <label htmlFor="time-select">Choose a time :</label>
              <Select
                className="selectdate"
                id="time-select"
                options={availableTimes}
                value={
                  availableTimes.find((time) => time.value === selectedTime) ||
                  null
                }
                onChange={(option) =>
                  setSelectedTime(option ? option.value : null)
                }
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused
                      ? "lightgreen"
                      : provided.backgroundColor,
                    color: "black",
                  }),
                }}
              />
              <a onClick={handlechangerdv} className="true" id="spano">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {loading2 ? (
                  <div className="divloader">
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
          </div>
        </div>
      )}
      {validUrl === false && (
        <>
          <h1
            style={{
              color: "var(--subtitle)",
              fontSize: "25px",
              padding: "20px",
            }}
          >
            404 {t("404")}
          </h1>
          <h2 className="h1img2">{t(afficheerreur)}</h2>
        </>
      )}
      {validUrl2 == "bb" && (
        <div className="notification">
          <p className="en">
            Your request is being processed. You will receive an email
            confirming your appointment change if available.
          </p>
          <p className="ar">
          تم معالجة طلبك، وستتلقى بريدًا إلكترونيًا يؤكد تغيير موعدك إن كان متاحًا
          </p>
        </div>
      )}
      {validUrl2 == "dd" && (
        <div className="notification">
          <p className="en">
            Please note that you are allowed to modify your appointment only
            once.
          </p>
          <p className="ar">
            يرجى ملاحظة أنه يُسمح لك بتعديل موعدك مرة واحدة فقط
          </p>
        </div>
      )}
    </>
  );
};

export default EditRendezVous;
