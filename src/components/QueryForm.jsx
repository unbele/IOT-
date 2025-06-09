import React, { useState, useEffect } from 'react';
import './query.css';
import { Link, useNavigate } from 'react-router-dom';

function QueryForm() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "zh");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const translations = {
  zh: {
    formTitle: "資料查詢表單",
    startDateLabel: "開始日期:",
    endDateLabel: "結束日期:",
    queryButton: "查詢",
    backButton: "返回主頁",
    error: "開始日期不能晚於結束日期，請重新選擇！"
  },
  en: {
    formTitle: "Data Query Form",
    startDateLabel: "Start Date:",
    endDateLabel: "End Date:",
    queryButton: "Search",
    backButton: "Back to Home",
    error: "Start date cannot be later than end date. Please select again!"
  },
  jp: {
    formTitle: "データ照会フォーム",
    startDateLabel: "開始日：",
    endDateLabel: "終了日：",
    queryButton: "検索",
    backButton: "ホームに戻る",
    error: "開始日は終了日より後にできません。再度選択してください！"
  },
  kr: {
    formTitle: "데이터 조회 양식",
    startDateLabel: "시작 날짜:",
    endDateLabel: "종료 날짜:",
    queryButton: "조회",
    backButton: "홈으로 돌아가기",
    error: "시작 날짜는 종료 날짜보다 늦을 수 없습니다. 다시 선택하세요!"
  },
  fr: {
    formTitle: "Formulaire de requête de données",
    startDateLabel: "Date de début :",
    endDateLabel: "Date de fin :",
    queryButton: "Rechercher",
    backButton: "Retour à l'accueil",
    error: "La date de début ne peut pas être postérieure à la date de fin. Veuillez réessayer !"
  },
  ru: {
    formTitle: "Форма запроса данных",
    startDateLabel: "Дата начала:",
    endDateLabel: "Дата окончания:",
    queryButton: "Поиск",
    backButton: "Вернуться на главную",
    error: "Дата начала не может быть позже даты окончания. Пожалуйста, выберите заново!"
  }
};

  const t = translations[language];

  useEffect(() => {
    const stored = localStorage.getItem("language") || "zh";
    setLanguage(stored);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      setError(t.error);
    } else {
      setError("");
      navigate(`/query-result?start_date=${startDate}&end_date=${endDate}`);
    }
  };

  return (
    <div className="query-page">
      <form onSubmit={handleSubmit}>
        <h2>{t.formTitle}</h2>
        <label>{t.startDateLabel}</label>
        <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <label>{t.endDateLabel}</label>
        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <button className="search" type="submit">{t.queryButton}</button>
        {error && <div className="error">{error}</div>}
        <div className="btn-container">
          <Link to="/">{t.backButton}</Link>
        </div>
      </form>
    </div>
  );
}

export default QueryForm;