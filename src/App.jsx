import React, { useEffect, useState } from 'react';
import './chart.css';
import ChartDisplay from './components/ChartDisplay';
import LanguageSelector from './components/LanguageSelector';
import { Link } from 'react-router-dom';

const translations = {
  zh: {
    title: "ESP IoT 系統",
    queryButton: "查詢歷史資料",
    tempLabel: "溫度 (°C)",
    humidityLabel: "濕度 (%)",
    tempmin: "溫度過低！",
    tempmax: "溫度過高，已開啟風扇降溫！",
    humiditymin: "濕度過低！",
    humiditymax: "濕度過高！",
    normalMessage: "所有數據正常", 
  },
  en: {
    title: "ESP IoT System",
    queryButton: "Query Historical Data",
    tempLabel: "Temperature (°C)",
    humidityLabel: "Humidity (%)",
    tempmin: "The temperature is too low!",
    tempmax: "The temperature is too high, Fan cooling is on!",
    humiditymin: "Humidity is too low!",
    humiditymax: "The humidity is too high!",
    normalMessage: "All values are normal", 
  },
  jp: {
    title: "ESP IoT システム",
    queryButton: "履歴データを照会",
    normalMessage: "すべての値は正常です",
    tempLabel: "温度 (°C)",
    humidityLabel: "湿度 (%)",
    tempmin: "気温が低すぎます!",
		tempmax: "気温が高すぎます，ファン冷却がオン！",
    humiditymin: "湿度が低すぎます!",
		humiditymax: "湿度が高すぎます！",
  },
  kr: {
    title: "ESP IoT 시스템",
    queryButton: "기록 데이터 조회",
    normalMessage: "모든 값이 정상입니다",
    tempLabel: "온도 (°C)",
    humidityLabel: "습도 (%)",
    tempmin: "온도가 너무 낮습니다!",
		tempmax: "온도가 너무 높아요，팬 냉각이 켜져 있습니다！",
    humiditymin: "습도가 너무 낮습니다!",
		humiditymax: "습도가 너무 높아요!",
  },
  fr: {
    title: "Système ESP IoT",
    queryButton: "Consulter les données historiques",
    normalMessage: "Toutes les valeurs sont normales",
    tempLabel: "Température (°C)",
    humidityLabel: "Humidité (%)",
    tempmin: "La température est trop basse !",
    tempmax: "La température est trop élevée，Le refroidissement par ventilateur est activé！",
    humiditymin: "L'humidité est trop basse !",
		humiditymax: "L'humidité est trop élevée !",
  },
  ru: {
    title: "Система ESP IoT",
    queryButton: "Запросить исторические данные",
    normalMessage: "Все значения в норме",
    tempLabel: "Температура (°C)",
    humidityLabel: "Влажность (%)",
    tempmin: "Температура слишком низкая!",
    tempmax: "Температура слишком высокая，Вентилятор охлаждения включен！",
    humiditymin: "Влажность слишком низкая!",
		humiditymax: "Влажность слишком высокая!",
  }
};

function App() {
  const [temp, setTemp] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [labels, setLabels] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [alert, setAlert] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'zh');

  // ✅ 修改 fetchData 傳入語言參數
  const fetchData = async (lang = language) => {
    try {
      const res = await fetch('http://localhost/arduino_data/chart.php?ajax=true');
      const json = await res.json();
      if (json.labels.length > 0) {
        const label = json.labels[0];
        const newTemp = parseFloat(json.tempData[0]);
        const newHumidity = parseFloat(json.humidityData[0]);

        console.log('Temp:', newTemp);
        console.log('Humidity:', newHumidity);

        setTemp(newTemp);
        setHumidity(newHumidity);
        setLabels((prev) => [...prev.slice(-7), label]);
        setTempData((prev) => [...prev.slice(-7), newTemp]);
        setHumidityData((prev) => [...prev.slice(-7), newHumidity]);

        const t = translations[lang];
        let msg = '';
        if (newTemp < 15) msg += t.tempmin + ' ';
        if (newTemp > 26) msg += t.tempmax + ' ';
        if (newHumidity < 50) msg += t.humiditymin + ' ';
        if (newHumidity > 70) msg += t.humiditymax + ' ';

        console.log('Alert msg:', msg);

        setAlert(msg);
        setShowNormal(msg === '');
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    fetchData(language); // ✅ 傳入當前語言
    const interval = setInterval(() => fetchData(language), 5000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div>
      <LanguageSelector language={language} setLanguage={setLanguage} />
      <h1>{translations[language].title}</h1>

      {/* ✅ 保留原來樣式，改用 React Router Link */}
      <div className="query-button-wrapper">
  <Link className="query-button" to="/query">
    {translations[language].queryButton}
  </Link>
</div>


      {/* ✅ 顯示警告或正常提示 */}
      {alert ? (
        <div className="alert">{alert}</div>
      ) : (
        <div className="normal">{translations[language].normalMessage}</div>
      )}

      <div className="realtime-data">
        <div className="data-box">
          <h2>{translations[language].tempLabel}</h2>
          <p>{temp} °C</p>
        </div>
        <div className="data-box">
          <h2>{translations[language].humidityLabel}</h2>
          <p>{humidity} %</p>
        </div>
      </div>

      <div className="cha-container">
        <div className="cha-box">
          <ChartDisplay
            id="tempChart"
            labels={labels}
            data={tempData}
            label="Temperature (°C)"
            color="rgba(0,255,204,1)"
          />
        </div>
        <div className="cha-box">
          <ChartDisplay
            id="humidityChart"
            labels={labels}
            data={humidityData}
            label="Humidity (%)"
            color="rgba(0,128,255,1)"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
