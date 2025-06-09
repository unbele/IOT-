import React, { useEffect, useState } from 'react';
import './result.css';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function DisplayResult({ startDate, endDate }) {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "zh");
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState(1);
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const t = {
    zh: {
      title: "查詢結果",
      backHome: "返回主頁",
      backQuery: "返回查詢頁",
      showChart: "顯示折線圖",
      exportCSV: "匯出CSV",
      loading: "載入中...",
      noData: "查無資料",
      loadFail: "載入資料失敗：",
      statsTemp: "溫度 (平均 / 最大 / 最小)：",
      statsHumi: "濕度 (平均 / 最大 / 最小)：",
      time: "時間",
      temperature: "溫度 (°C)",
      humidity: "濕度 (%)",
      goto: "轉至",
      chart:"折線圖表",
    },
    en: {
      title: "Query Result",
      backHome: "Back to Home",
      backQuery: "Back to Query Page",
      showChart: "Show Line Chart",
      exportCSV: "Export CSV",
      loading: "Loading...",
      noData: "No records found",
      loadFail: "Failed to load data: ",
      statsTemp: "Temperature (Avg / Max / Min): ",
      statsHumi: "Humidity (Avg / Max / Min): ",
      time: "Time",
      temperature: "Temperature (°C)",
      humidity: "Humidity (%)",
      goto: "Go to",
      chart: "Line Chart",
    },
    jp: {
      title: "検索結果",
      backHome: "ホームに戻る",
      backQuery: "検索ページに戻る",
      showChart: "折れ線グラフを表示",
      exportCSV: "CSVをエクスポート",
      loading: "読み込み中...",
      noData: "データが見つかりません",
      loadFail: "データの読み込みに失敗しました: ",
      statsTemp: "温度 (平均 / 最大 / 最小)：",
      statsHumi: "湿度 (平均 / 最大 / 最小)：",
      time: "時間",
      temperature: "温度 (°C)",
      humidity: "湿度 (%)",
      goto: "へ移動",
      chart: "折れ線グラフ",
    },
    kr: {
      title: "조회 결과",
      backHome: "홈으로 돌아가기",
      backQuery: "조회 페이지로 돌아가기",
      showChart: "라인 차트 보기",
      exportCSV: "CSV 내보내기",
      loading: "불러오는 중...",
      noData: "데이터 없음",
      loadFail: "데이터 불러오기 실패: ",
      statsTemp: "온도 (평균 / 최대 / 최소): ",
      statsHumi: "습도 (평균 / 최대 / 최소): ",
      time: "시간",
      temperature: "온도 (°C)",
      humidity: "습도 (%)",
      goto: "이동",
      chart: "선형 차트",
    },
    fr: {
      title: "Résultat de la requête",
      backHome: "Retour à l'accueil",
      backQuery: "Retour à la page de requête",
      showChart: "Afficher le graphique",
      exportCSV: "Exporter en CSV",
      loading: "Chargement...",
      noData: "Aucune donnée trouvée",
      loadFail: "Échec du chargement des données : ",
      statsTemp: "Température (moy / max / min): ",
      statsHumi: "Humidité (moy / max / min): ",
      time: "Temps",
      temperature: "Température (°C)",
      humidity: "Humidité (%)",
      goto: "Aller à",
      chart: "Graphique en ligne",
    },
    ru: {
      title: "Результат запроса",
      backHome: "Назад на главную",
      backQuery: "Назад к запросу",
      showChart: "Показать график",
      exportCSV: "Экспорт в CSV",
      loading: "Загрузка...",
      noData: "Данные не найдены",
      loadFail: "Ошибка загрузки данных: ",
      statsTemp: "Температура (ср / макс / мин): ",
      statsHumi: "Влажность (ср / макс / мин): ",
      time: "Время",
      temperature: "Температура (°C)",
      humidity: "Влажность (%)",
      goto: "Перейти",
      chart: "Линейный график",
    }
  };

  

  const fetchPageData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/arduino_data/display.php?start_date=${startDate}&end_date=${endDate}&page=${page}`);
      const json = await res.json();
      if (json.records) {
        setRecords(json.records);
        setTotalPages(json.total_pages || 1);
        setCurrentPage(page);
        setJumpPage(page);
        setStats(json.stats || null);
      } else {
        setRecords([]);
        setTotalPages(1);
        setError(t[language].noData);
      }
    } catch (err) {
      setError(t[language].loadFail + err.message);
    }
    setLoading(false);
  };

  const fetchAllChartData = async () => {
    try {
      const res = await fetch(`http://localhost/arduino_data/display.php?start_date=${startDate}&end_date=${endDate}&all=true`);
      const json = await res.json();
      if (json.records) setAllRecords(json.records);
    } catch (err) {
      console.error(t[language].loadFail, err);
    }
  };

  useEffect(() => {
    fetchPageData(1);
    fetchAllChartData();
    setPageWindowStart(1);
  }, [startDate, endDate]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    fetchPageData(page);
    scrollToTop();
    // 計算新視窗起點，使 page 成為中間值
    const newStart = Math.max(1, Math.min(page - 1, totalPages - 2));
    setPageWindowStart(newStart);
  }
};


  const handleExportCSV = () => {
    const csvRows = [
  `${t[language].time},${t[language].temperature},${t[language].humidity}`,
  ...allRecords.map(r => `${r.created_at},${r.temperature},${r.humidity}`)
];

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `iot_data_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let chartData = { labels: [], datasets: [] };
  if (allRecords.length > 0) {
    const grouped = {};
    allRecords.forEach(r => {
      const hour = r.created_at.slice(0, 13) + ":00";
      if (!grouped[hour]) grouped[hour] = { temp: [], humi: [] };
      grouped[hour].temp.push(parseFloat(r.temperature));
      grouped[hour].humi.push(parseFloat(r.humidity));
    });

    const labels = Object.keys(grouped);
    const tempPoints = labels.map(hour => {
      const values = grouped[hour].temp;
      return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
    });
    const humiPoints = labels.map(hour => {
      const values = grouped[hour].humi;
      return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
    });

    chartData = {
      labels: labels,
      datasets: [
        {
          label: t[language].temperature,
          data: tempPoints,
          borderColor: 'rgba(0,255,204,1)',
          backgroundColor: 'transparent',
          tension: 0.3,
        },
        {
          label: t[language].humidity,
          data: humiPoints,
          borderColor: 'rgba(0,128,255,1)',
          backgroundColor: 'transparent',
          tension: 0.3,
        },
      ],
    };
  }

  return (
    <div className="result-box">
      <h3>{t[language].title}</h3>
      <div className="button-row">
        <Link to="/" className="query-button">{t[language].backHome}</Link>
        <Link to="/query" className="query-button">{t[language].backQuery}</Link>
        <button className="query-button" onClick={() => setShowChart(!showChart)}>{t[language].showChart}</button>
        <button className="query-button" onClick={handleExportCSV}>{t[language].exportCSV}</button>
      </div>

      {loading && <p>{t[language].loading}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {stats && (
        <div style={{ textAlign: "center", margin: "15px", color: "#00ffcc" }}>
          <p>{t[language].statsTemp}{stats.temp_avg} / {stats.temp_max} / {stats.temp_min}</p>
          <p>{t[language].statsHumi}{stats.humi_avg} / {stats.humi_max} / {stats.humi_min}</p>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>{t[language].time}</th>
            <th>{t[language].temperature}</th>
            <th>{t[language].humidity}</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.created_at}</td>
              <td>{r.temperature}</td>
              <td>{r.humidity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showChart && (
  <div className="modal" onClick={() => setShowChart(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <span className="close" onClick={() => setShowChart(false)}>&times;</span>
      <h3 style={{ textAlign: "center", color: "#00ffcc" }}>{t[language].chart}</h3>
      <div className="cha-container">
        <div className="cha">
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: t[language].temperature,
                  data: chartData.datasets[0].data,
                  borderColor: 'rgba(0,255,204,1)',
                  backgroundColor: 'transparent',
                  tension: 0.3,
                }
              ]
            }}
          />
        </div>
        <div className="cha">
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: t[language].humidity,
                  data: chartData.datasets[1].data,
                  borderColor: 'rgba(0,128,255,1)',
                  backgroundColor: 'transparent',
                  tension: 0.3,
                }
              ]
            }}
          />
        </div>
      </div>
    </div>
  </div>
)}


      <div className="pagination">
  {/* << 向前翻頁 */}
  {pageWindowStart > 1 && (
    <button
      onClick={() => {
        const newStart = Math.max(1, pageWindowStart - 1);
        setPageWindowStart(newStart);
        handlePageChange(newStart + 1); // 讓中間值保持正確
      }}
    >
      {'<<'}
    </button>
  )}

  {/* 動態生成 3 個頁碼 */}
  {[...Array(Math.min(3, totalPages - pageWindowStart + 1)).keys()].map(i => {
    const pageNum = pageWindowStart + i;
    return (
      <button
        key={pageNum}
        className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
        onClick={() => handlePageChange(pageNum)}
      >
        {pageNum}
      </button>
    );
  })}

  {/* >> 向後翻頁 */}
  {pageWindowStart + 2 < totalPages && (
    <button
      onClick={() => {
        const newStart = Math.min(totalPages - 2, pageWindowStart + 1);
        setPageWindowStart(newStart);
        handlePageChange(newStart + 1); // 保持中間值
      }}
    >
      {'>>'}
    </button>
  )}

  {/* 跳轉輸入框 */}
  <div className="page-input">
    <input
      type="number"
      min="1"
      max={totalPages}
      value={jumpPage}
      onChange={(e) => setJumpPage(Number(e.target.value))}
    />
    <span>/ {totalPages}</span>
    <button onClick={() => handlePageChange(jumpPage)}>{t[language].goto}</button>
  </div>
</div>

    </div>
  );
}

export default DisplayResult;
