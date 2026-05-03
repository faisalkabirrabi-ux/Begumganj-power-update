import { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Bell, 
  Zap, 
  CloudLightning, 
  Thermometer, 
  Wind, 
  CloudRain, 
  Clock, 
  MapPin, 
  Share2, 
  Menu, 
  X, 
  BarChart3, 
  Info, 
  Settings, 
  Home, 
  MessageSquare, 
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Search,
  Globe,
  Send,
  Loader2,
  Bot,
  SunMoon,
  ShieldCheck,
  Ear,
  Camera,
  Volume2,
  VolumeX,
  BatteryMedium,
  History,
  Sparkles,
  ZapOff,
  FileText,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictPowerOutage, type OutagePrediction } from './services/aiService';
import { fetchLatestOfficialNews, type OfficialNews } from './services/newsService';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Multi-language translations
const translations = {
  bn: {
    title: 'বেগমগঞ্জ বিদ্যুৎ সেবা',
    tagline: 'লাইভ লোডশেডিং ট্র্যাকার ও আপডেট',
    realtime: 'রিয়েলটাইম',
    lastUpdate: 'শেষ আপডেট',
    powerStatus: 'বিদ্যুৎ বর্তমান অবস্থা',
    powerOn: 'বিদ্যুৎ আছে',
    powerOff: 'বিদ্যুৎ নেই',
    voltage: 'ভোল্টেজ',
    weather: 'আবহাওয়া',
    lightningAlert: 'বজ্রপাত সতর্কতা',
    lightningText: 'বেগমগঞ্জের আকাশে বজ্রপাত পরিলক্ষিত হয়েছে। নিরাপদ থাকুন।',
    maintenanceUpdate: 'লাইনের রক্ষণাবেক্ষণ আপডেট',
    maintenanceStatus: 'চলমান কাজ সমূহ',
    aiBot: 'বিদ্যুৎ সহায়তা (AI)',
    aiGreeting: 'আসসালামু আলাইকুম! আমি বেগমগঞ্জ বিদ্যুৎ এআই। কীভাবে সাহায্য করতে পারি?',
    aiPlaceholder: 'এখানে লিখুন...',
    aiAnalyzing: 'সার্ভার চেক করছি...',
    areaStatus: 'এলাকা ডিটেইলস',
    communityUpdate: 'কমিউনিটি রিপোর্ট',
    substationUpdate: 'সাবস্টেশন লোড আপডেট',
    historyData: 'গত ২৪ ঘণ্টার লোড হিস্ট্রি',
    todayReport: 'আজকের রিপোর্ট',
    totalLoadShedding: 'আজকের মোট লোডশেডিং',
    currentWeather: 'বর্তমান আবহাওয়া',
    humidity: 'আর্দ্রতা',
    wind: 'বাতাস',
    windSpeed: 'বাতাস গতি',
    allAreas: 'সব এলাকা',
    powerAvailable: 'বিদ্যুৎ আছে',
    substations: 'সাবস্টেশন',
    developedBy: 'ডেভেলপার',
    home: 'হোম',
    alerts: 'অ্যালার্ট',
    billCheck: 'অনলাইন বিল চেক',
    notice: 'নোটিশ বোর্ড',
    liveSyncing: 'লাইভ ডেটা সিঙ্ক হচ্ছে...',
    currentLoad: 'বর্তমান লোড',
    maxCapacity: 'সর্বোচ্চ ক্ষমতা',
    feeders: 'ফিডার সমূহ',
    refreshData: 'ডেটা রিফ্রেশ করুন',
    fetching: 'ডেটা আনা হচ্ছে...',
    safetyAlert: 'নিরাপত্তা অ্যালার্ট',
    proTips: 'প্রো-টিপস',
    safetyTitle: 'বিদ্যুৎ সুরক্ষা নির্দেশিকা',
    stayAway: 'ছিঁড়ে পড়া তার থেকে অন্তত ১০ ফুট দূরে থাকুন।',
    callImmediate: 'তৎক্ষণাৎ ১৬৬৭৭ নম্বরে কল করে জানান।',
    wetHands: 'ভেজা হাতে বৈদ্যুতিক সুইচ বা যন্ত্র ধরবেন না।',
    stormSafety: 'ঝড়ের সময় দামি বৈদ্যুতিক যন্ত্রের প্লাগ খুলে রাখুন।',
    emergencyContact: 'জরুরী যোগাযোগ',
    loadSheddingTimer: 'লোডশেডিং সময়কাল',
    powerOnDuration: 'বিদ্যুৎ নিরবচ্ছিন্ন আছে',
    onTime: 'সময় ধরে চালু',
    offTime: 'সময় ধরে বন্ধ',
    predictiveAlert: 'স্মার্ট পুশ অ্যালার্ট',
    predictiveTitle: 'সম্ভাব্য লোডশেডিং সর্তকতা',
    predictiveText: 'পার্শ্ববর্তী ফিডারে লোডশেডিং শুরু হয়েছে। পরবর্তী ৫-১০ মিনিটে আপনার এলাকায় বিদ্যুৎ যাওয়ার সম্ভাবনা রয়েছে।',
    energyAdvisor: 'সাশ্রয়ী টিপস',
    energyTitle: 'সাশ্রয়ী পরামর্শ',
    peakHourAlert: 'পিক আওয়ার (বিকাল ৫টা - রাত ১১টা)',
    peakHourText: 'পিক আওয়ার শুরু হয়েছে। দয়া করে পানির পাম্প ও অপ্রয়োজনীয় বাতি বন্ধ রাখুন।',
    ledSaving: 'LED বাল্ব ব্যবহারে সাধারণ বাল্বের চেয়ে ৭৫% বিদ্যুৎ সাশ্রয় হয়।',
    liveCrew: 'লাইনম্যান লাইভ স্ট্যাটাস',
    crewLocation: 'মেরামতকারী দল বর্তমানে কাজ করছেন:',
    powerQuality: 'পাওয়ার কোয়ালিটি স্কোর',
    voltageGuide: 'ভোল্টেজ ১৮০V এর নিচে নামলে ফ্রিজ বন্ধ রাখা নিরাপদ।',
    deviceHealth: 'ইলেকট্রনিক্স সেফটি স্কোর',
    deviceHealthDesc: 'বিগত ২৪ ঘণ্টায় ভোল্টেজের ওঠানামার ওপর ভিত্তি করে সুরক্ষা স্কোর।',
    safetyWarning: 'সতর্কতা: আজ ভোল্টেজ খুব বেশি ওঠানামা করছে, দামি ইলেকট্রনিক্স বন্ধ রাখুন।',
    solarIps: 'সোলার ও আইপিএস ম্যানেজমেন্ট',
    ipsTimer: 'আইপিএস ব্যাকআপ ক্যালকুলেটর',
    anonymousReport: 'গোপন অভিযোগ রিপোর্ট',
    reportIssue: 'লাইন সমস্যা বা অবৈধ সংযোগ রিপোর্ট করুন',
    homeMonitor: 'প্রবাসীদের জন্য বাড়ি মনিটর',
    meterInput: 'আপনার মিটার নম্বর লিখুন',
    noakhaliLive: 'নোয়াখালী লাইভ আপডেট',
    maijdee: 'মাইজদী',
    chowmuhani: 'চৌমুহনী',
    sonaimuri: 'সোনাইমুড়ী',
    chatkhil: 'চাটখিল',
    senbagh: 'সেনবাগ',
    companiganj: 'কোম্পানীগঞ্জ',
    kabirhat: 'কবিরহাট',
    subarnachar: 'সুবর্ণচর',
    hatiya: 'হাতিয়া',
    pdbNotice: 'ফিড অফিসিয়াল নোটিশ বোর্ড',
    officialUpdates: 'বিদ্যুৎ উন্নয়ন বোর্ডের সর্বশেষ আপডেট ও নোটিশ।',
    visitPdb: 'নোটিশ বোর্ড দেখুন',
    noakhaliLive: 'নোয়াখালী লাইভ আপডেট',
    stable: 'স্বাভাবিক',
    loadshedding: 'লোড়শেডিং',
    digitalAdda: 'বেগমগঞ্জ নিউজ ফিড',
    noakhaliNews: 'নোয়াখালী জেলা ও বেগমগঞ্জের সর্বশেষ খবর',
  },
  en: {
    title: 'Begumganj Power Service',
    tagline: 'Live Loadshedding Tracker & Updates',
    realtime: 'Real-time',
    lastUpdate: 'Last Update',
    powerStatus: 'Current Power Status',
    powerOn: 'Power ON',
    powerOff: 'Power OFF',
    voltage: 'Voltage',
    weather: 'Weather',
    lightningAlert: 'Lightning Alert',
    lightningText: 'Lightning observed in Begumganj sky. Stay safe.',
    maintenanceUpdate: 'Maintenance Updates',
    maintenanceStatus: 'Ongoing Line Works',
    aiBot: 'Power Support (AI)',
    aiGreeting: 'Hello! I am Begumganj Power AI. How can I help you?',
    aiPlaceholder: 'Type here...',
    aiAnalyzing: 'Checking server...',
    areaStatus: 'Area Specific Details',
    communityUpdate: 'Community Report',
    substationUpdate: 'Substations Load Update',
    historyData: 'Load History (Last 24h)',
    todayReport: 'Today\'s Report',
    totalLoadShedding: 'Total Loadshedding Today',
    currentWeather: 'Current Weather',
    humidity: 'Humidity',
    wind: 'Wind',
    windSpeed: 'Wind Speed',
    allAreas: 'All Areas',
    powerAvailable: 'Power On',
    substations: 'Substations',
    developedBy: 'Developed By',
    home: 'Home',
    alerts: 'Alerts',
    billCheck: 'Check Bill Online',
    notice: 'Notice Board',
    liveSyncing: 'Live data syncing...',
    currentLoad: 'Current Load',
    maxCapacity: 'Max Capacity',
    feeders: 'Feeder List',
    refreshData: 'Refresh Data',
    fetching: 'Fetching Data...',
    safetyAlert: 'Safety Alert',
    proTips: 'Pro-Tips',
    safetyTitle: 'Electrical Safety Guide',
    stayAway: 'Stay at least 10 feet away from fallen wires.',
    callImmediate: 'Call 16677 immediately to report.',
    wetHands: 'Never touch switches or appliances with wet hands.',
    stormSafety: 'Unplug sensitive electronics during heavy storms.',
    emergencyContact: 'Emergency Contact',
    loadSheddingTimer: 'Loadshedding Timer',
    powerOnDuration: 'Power is Stable',
    onTime: 'Online for',
    offTime: 'Offline for',
    predictiveAlert: 'Smart Push Alert',
    predictiveTitle: 'Predicted Outage Warning',
    predictiveText: 'Load shedding started in adjacent feeder. Outage expected in your area in 5-10 mins.',
    energyAdvisor: 'Savings Advisor',
    energyTitle: 'Energy Saving Tips',
    peakHourAlert: 'Peak Hour (5 PM - 11 PM)',
    peakHourText: 'Peak hours active. Please turn off water pumps and unnecessary lights.',
    ledSaving: 'Using LED bulbs saves 75% more energy than regular bulbs.',
    liveCrew: 'Lineman Live Status',
    crewLocation: 'Maintenance crew currently working at:',
    powerQuality: 'Power Quality Score',
    voltageGuide: 'It is safer to unplug fridge/AC if voltage drops below 180V.',
    deviceHealth: 'Electronics Safety Score',
    deviceHealthDesc: 'Safety score based on voltage fluctuations in the last 24h.',
    safetyWarning: 'Warning: High voltage fluctuation detected today. Keep sensitive devices off.',
    solarIps: 'Solar & IPS Management',
    ipsTimer: 'IPS Backup Calculator',
    anonymousReport: 'Anonymous Report',
    reportIssue: 'Report line issue or illegal connection',
    homeMonitor: 'Expert Home Monitor',
    meterInput: 'Enter Meter Number',
    noakhaliLive: 'Noakhali Live Feed',
    maijdee: 'Maijdee',
    chowmuhani: 'Chowmuhani',
    sonaimuri: 'Sonaimuri',
    chatkhil: 'Chatkhil',
    senbagh: 'Senbagh',
    companiganj: 'Companiganj',
    kabirhat: 'Kabirhat',
    subarnachar: 'Subarnachar',
    hatiya: 'Hatiya',
    pdbNotice: 'Official PDB Notice Board',
    officialUpdates: 'Latest announcements and notices from the Power Development Board.',
    visitPdb: 'Visit Notice Board',
    noakhaliLive: 'Noakhali Live Status',
    stable: 'Stable',
    loadshedding: 'Outage',
    digitalAdda: 'Begumganj News Feed',
    noakhaliNews: 'Latest updates from Noakhali & Begumganj',
  }
};

// Mock date generation
const generateHistoricalData = (lang: string) => {
  const data = [];
  const now = new Date();
  const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
      fullDate: time.toLocaleString(locale),
      'চৌমুহনী': Math.random() * 5 + 3,
      'বেগমগঞ্জ-১': Math.random() * 4 + 2,
      'ছয়ানী': Math.random() * 3 + 1,
    });
  }
  return data;
};

const substations = [
  { id: 1, name: 'চৌমুহনী সাবস্টেশন', capacity: '১০ মেগাওয়াট', baseLoad: 7.2, maxLoad: 10.0, feeders: 'চৌমুহনী সদর, গনিপুর, ডিবি রোড' },
  { id: 2, name: 'বেগমগঞ্জ-১ সাবস্টেশন', capacity: '৮ মেগাওয়াট', baseLoad: 5.4, maxLoad: 8.0, feeders: 'বাংলাবাজার, কাদিরপুর, জিরতলী' },
  { id: 3, name: 'ছয়ানী সাবস্টেশন', capacity: '৫ মেগাওয়াট', baseLoad: 2.8, maxLoad: 5.0, feeders: 'ছয়ানী বাজার, মিরওয়ারিশপুর' },
];

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const t = translations[lang];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPowerOn, setIsPowerOn] = useState(() => {
    const saved = localStorage.getItem('power_state');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [lastPowerStateChange, setLastPowerStateChange] = useState(() => {
    const saved = localStorage.getItem('power_state_change');
    return saved !== null ? parseInt(saved) : Date.now() - 3600000;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(Date.now());
  const [selectedArea, setSelectedArea] = useState('চৌমুহনী সদর');
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiPredicting, setIsAiPredicting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<OutagePrediction | null>(null);
  const [officialNews, setOfficialNews] = useState<OfficialNews[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  
  const noakhaliCities = useMemo(() => [
    { nameEn: 'Maijdee', nameBn: 'মাইজদী' },
    { nameEn: 'Chowmuhani', nameBn: 'চৌমুহনী' },
    { nameEn: 'Sonaimuri', nameBn: 'সোনাইমুড়ী' },
    { nameEn: 'Chatkhil', nameBn: 'চাটখিল' },
    { nameEn: 'Senbagh', nameBn: 'সেনবাগ' },
    { nameEn: 'Basurhat', nameBn: 'বসুরহাট' },
    { nameEn: 'Kabirhat', nameBn: 'কবিরহাট' },
    { nameEn: 'Hatiya', nameBn: 'হাতিয়া' },
    { nameEn: 'Subarnachar', nameBn: 'সুবর্ণচর' },
  ], []);

  const [cityStatus, setCityStatus] = useState<Record<string, 'on' | 'off'>>({});

  useEffect(() => {
    const generateStatus = () => {
      const newStatus: Record<string, 'on' | 'off'> = {};
      noakhaliCities.forEach(city => {
        newStatus[city.nameEn] = Math.random() > 0.3 ? 'on' : 'off';
      });
      setCityStatus(newStatus);
    };
    generateStatus();
    const interval = setInterval(generateStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [noakhaliCities]);

  const [historyRange, setHistoryRange] = useState<'3h' | '12h' | '24h' | '7d'>('24h');
  const [areaFilter, setAreaFilter] = useState<'all' | 'on' | 'off'>('all');
  const [showPredictiveAlert, setShowPredictiveAlert] = useState(true);
  const [powerQualityScore, setPowerQualityScore] = useState(88);
  const [qualityHistoryRange, setQualityHistoryRange] = useState<'7d' | '30d'>('7d');
  const [deviceHealthScore, setDeviceHealthScore] = useState(92);
  const [fluctuationCount, setFluctuationCount] = useState(3);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isBatterySaver, setIsBatterySaver] = useState(false);
  const [meterNumber, setMeterNumber] = useState('');
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [ipsConfig, setIpsConfig] = useState({ capacity: 800, load: 200 });

  const qualityHistoryData = useMemo(() => {
    const days = qualityHistoryRange === '7d' ? 7 : 30;
    return Array.from({ length: days }).map((_, i) => ({
      day: days - i,
      score: 75 + Math.floor(Math.random() * 20),
      voltage: 200 + Math.floor(Math.random() * 30),
    })).reverse();
  }, [qualityHistoryRange]);

  const [currentVoltage, setCurrentVoltage] = useState(215);
  const [newsPosts, setNewsPosts] = useState([
    { id: 1, title: lang === 'bn' ? 'বেগমগঞ্জ সরকারি পাইলট উচ্চ বিদ্যালয়ে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত' : 'Annual sports competition held at Begumganj Govt Pilot High School', time: '২ ঘণ্টা আগে' },
    { id: 2, title: lang === 'bn' ? 'চৌমুহনীতে যানজট নিরসনে নতুন ট্রাফিক নিয়ম চালু' : 'New traffic rules implemented in Choumuhani to reduce congestion', time: '৫ ঘণ্টা আগে' },
  ]);

  const [areaStatuses, setAreaStatuses] = useState<Record<string, boolean>>({
    'চৌমুহনী সদর': true,
    'গনিপুর এলাকা': true,
    'ডিবি রোড': false,
    'বাংলাবাজার': true,
    'জিরতলী এলাকা': true,
    'ছয়ানী বাজার': true,
    'মিরওয়ারিশপুর': false,
    'কাদিরপুর': true,
    'রাজগঞ্জ': true,
  });

  const [districtStatus, setDistrictStatus] = useState([
    { id: '1', nameBn: 'মাইজদী', nameEn: 'Maijdee', status: 'on' },
    { id: '2', nameBn: 'চৌমুহনী', nameEn: 'Chowmuhani', status: 'off' },
    { id: '3', nameBn: 'সোনাইমুড়ী', nameEn: 'Sonaimuri', status: 'on' },
    { id: '4', nameBn: 'চাটখিল', nameEn: 'Chatkhil', status: 'on' },
    { id: '5', nameBn: 'সেনবাগ', nameEn: 'Senbagh', status: 'off' },
    { id: '6', nameBn: 'কবিরহাট', nameEn: 'Kabirhat', status: 'on' },
    { id: '7', nameBn: 'সুবর্ণচর', nameEn: 'Subarnachar', status: 'on' },
    { id: '8', nameBn: 'হাতিয়া', nameEn: 'Hatiya', status: 'on' },
  ]);

  useEffect(() => {
    // Randomly update status to simulate live data
    const interval = setInterval(() => {
      setDistrictStatus(prev => prev.map(city => ({
        ...city,
        status: Math.random() > 0.9 ? (city.status === 'on' ? 'off' : 'on') : city.status
      })));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const historyData = useMemo(() => generateHistoricalData(lang), [lang]);
  
  const runAiPrediction = async () => {
    setIsAiPredicting(true);
    // Simulate complex grid context
    const mockWeather = "Partly cloudy, 32°C. High humidity. Potential localized storms in Noakhali area.";
    const mockGridLoad = 78 + Math.floor(Math.random() * 15);
    
    try {
      const result = await predictPowerOutage(historyData.slice(-5), mockWeather, mockGridLoad);
      setAiPrediction(result);
      if (result.probability >= 60) {
        setShowPredictiveAlert(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiPredicting(false);
    }
  };

  const loadOfficialNews = async () => {
    setIsLoadingNews(true);
    try {
      const news = await fetchLatestOfficialNews();
      setOfficialNews(news);
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runAiPrediction();
      loadOfficialNews();
    }, 2000); // Wait for initial load
    return () => clearTimeout(timer);
  }, []);

  const filteredHistoryData = useMemo(() => {
    if (historyRange === '24h') return historyData;
    const slices: Record<string, number> = { '3h': 3, '12h': 12, '7d': 168 };
    const sliceCount = slices[historyRange] || 24;
    return historyData.slice(-sliceCount);
  }, [historyData, historyRange]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'error' | 'info'}[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dailyReport = [
    { area: 'চৌমুহনী সদর', offTime: '০৯:৪৫ AM', onTime: '১০:৫০ AM', duration: '০১ ঘণ্টা ০৫ মি.' },
    { area: 'জিরতলী এলাকা', offTime: '০৮:৩০ AM', onTime: '০৯:৩০ AM', duration: '০১ ঘণ্টা' },
    { area: 'মিরওয়ারিশপুর', offTime: '১১:১৫ AM', onTime: '—', duration: '—' },
    { area: 'রাজগঞ্জ', offTime: '০৭:০০ AM', onTime: '০৮:১৫ AM', duration: '০১ ঘণ্টা ১৫ মি.' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    addToast(lang === 'bn' ? 'সার্ভার থেকে লেটেষ্ট ডেটা আনা হচ্ছে...' : 'Fetching latest data from server...', 'info');
    
    setTimeout(() => {
      setLastCheckedTime(Date.now());
      setIsRefreshing(false);
      
      const newStatuses = { ...areaStatuses };
      let changes = 0;
      Object.keys(newStatuses).forEach(area => {
        if (Math.random() > 0.85) {
          newStatuses[area] = !newStatuses[area];
          changes++;
        }
      });
      setAreaStatuses(newStatuses);
      
      addToast(lang === 'bn' ? 'ডেটা সফলভাবে আপডেট করা হয়েছে' : 'Data updated successfully', 'success');
      if (changes > 0) {
        addToast(lang === 'bn' ? `${changes}টি এলাকার বিদ্যুৎ অবস্থা পরিবর্তিত হয়েছে` : `${changes} area statuses changed`, 'info');
      }
    }, 2000);
  };

  const playPowerSound = (on: boolean) => {
    if (!isSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(on ? 440 : 220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(on ? 880 : 110, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error('Audio failed', e);
    }
  };

  const togglePower = () => {
    const newState = !isPowerOn;
    setIsPowerOn(newState);
    setLastPowerStateChange(Date.now());
    localStorage.setItem('power_state', JSON.stringify(newState));
    localStorage.setItem('power_state_change', Date.now().toString());
    playPowerSound(newState);
    
    addToast(
      lang === 'bn' 
        ? (newState ? 'প্রধান বিদ্যুৎ সংযোগ সফলভাবে চালু হয়েছে' : 'বজ্রপাত বা জরুরি কারণে প্রধান সংযোগ বিচ্ছিন্ন করা হয়েছে') 
        : (newState ? 'Main power restored' : 'Emergency power cut-off active'),
      newState ? 'success' : 'error'
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: 'বেগমগঞ্জের বিদ্যুৎ রিপোর্ট এখন এক ক্লিক-এ।',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: t.aiGreeting }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsAiTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const appContext = `
        You are the Begumganj Power Service Assistant (AI Bot). 
        Current App Context:
        - Language: ${lang}
        - Global Power Status: ${isPowerOn ? 'ON' : 'OFF'}
        - Area Statuses (Individual): ${JSON.stringify(areaStatuses)}
        - Weather: 32°C, Rain & Lightning risk detected.
        - Maintenance/Line Works in progress: ${JSON.stringify(maintenanceWorks)}
        - Substations: Choumuhani (Load: 7.2MW), Begumganj-1 (Load: 5.4MW), Chayani (Load: 2.8MW).
        
        Capabilities:
        1. Checking real-time power status for specific areas in Begumganj.
        2. Identifying ongoing line maintenance work locations.
        3. Providing weather updates and safety tips for lightning.
        
        Instruction: Answer in ${lang === 'bn' ? 'Bengali' : 'English'}. Be polite, use emojis, and provide accurate data based on the JSON objects provided. If the user asks why the link requires an email/login, explain that the app itself has no login system and this is a security feature of the AI Studio preview environment.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: appContext
        }
      });

      const response = result.text || (lang === 'bn' ? "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।" : "Sorry, no response found.");
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: lang === 'bn' ? "সার্ভারে সমস্যা হচ্ছে, অনুগ্রহ করে পরে চেষ্টা করুন।" : "Server error, please try again later." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const maintenanceWorks = [
    { location: 'চৌমুহনী পূর্ব বাজার', type: lang === 'bn' ? 'ট্রান্সফর্মার পরিবর্তন' : 'Transformer Replacement', status: lang === 'bn' ? 'কাজ চলছে' : 'In Progress', time: '০৩:০০ PM' },
    { location: 'কাদিরপুর রোড', type: lang === 'bn' ? 'লাইনের গাছ কাটা' : 'Tree Trimming', status: lang === 'bn' ? 'অপেক্ষা করছে' : 'Pending', time: '০৪:৩০ PM' },
  ];

  const LanguageSwitcher = () => (
    <div className="flex bg-slate-900/5 backdrop-blur-md p-1 rounded-2xl gap-1 border border-white/20" role="group" aria-label={lang === 'bn' ? 'ভাষা নির্বাচন করুন' : 'Select Language'}>
      <button 
        onClick={() => { setLang('bn'); triggerHaptic(); }} 
        aria-pressed={lang === 'bn'}
        className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all focus-visible:ring-2 focus-visible:ring-[#0077b6] ${lang === 'bn' ? 'bg-white/90 text-[#0077b6] shadow-sm translate-y-[1px] shadow-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
      >
        বাংলা
      </button>
      <button 
        onClick={() => { setLang('en'); triggerHaptic(); }} 
        aria-pressed={lang === 'en'}
        className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all focus-visible:ring-2 focus-visible:ring-[#0077b6] ${lang === 'en' ? 'bg-white/90 text-[#0077b6] shadow-sm translate-y-[1px] shadow-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
      >
        ENG
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#020617] font-sans selection:bg-[#0077b6]/30 overflow-x-hidden relative`}>
      
      {/* Background Neon Waves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] opacity-20"
        >
          <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] bg-[#0077b6]/10 rounded-full blur-[150px]"></div>
        </motion.div>
        
        {/* Live Pulse Wave Path */}
        {isPowerOn && (
          <svg className="absolute bottom-0 left-0 w-full h-64 text-emerald-500/5 opacity-50" preserveAspectRatio="none">
            <motion.path 
              animate={{ d: [
                "M0 100 Q 250 50 500 100 T 1000 100",
                "M0 100 Q 250 150 500 100 T 1000 100",
                "M0 100 Q 250 50 500 100 T 1000 100"
              ]}}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      <AnimatePresence>
        {/* Anonymous Reporting Modal */}
        {isReportingOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0f172a] border-4 border-[#0077b6] w-full max-w-lg rounded-none p-8 relative shadow-[12px_12px_0px_0px_rgba(0,119,182,1)]"
            >
              <button 
                onClick={() => setIsReportingOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 border-2 border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{t.anonymousReport}</h3>
                  <p className="text-sm font-bold text-white/40">{t.reportIssue}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0077b6] uppercase tracking-[0.2em] block">Location / Area</label>
                    <input className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-bold focus:border-[#0077b6] outline-none" placeholder="e.g. Khoyazpur Midya Bari" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0077b6] uppercase tracking-[0.2em] block">Problem Description</label>
                    <textarea className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-bold h-32 focus:border-[#0077b6] outline-none" placeholder="Details of hooks or line issues..." />
                  </div>
                  <div className="p-4 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 group">
                    <Camera className="w-6 h-6 text-white/40 group-hover:text-[#0077b6]" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white">Upload Proof Photo</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsReportingOpen(false);
                    addToast(lang === 'bn' ? 'রিপোর্ট সফলভাবে জমা হয়েছে' : 'Report submitted anonymously', 'success');
                  }}
                  className="w-full py-5 bg-[#0077b6] text-white font-black uppercase tracking-[0.3em] shadow-[6px_6px_0px_0px_rgba(0,52,89,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isAiOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-labelledby="ai-bot-title"
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-2xl z-50 border border-white/40 flex flex-col overflow-hidden"
          >
            <div className="bg-[#0077b6]/80 backdrop-blur-xl p-6 flex justify-between items-center text-white border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="ai-bot-title" className="font-bold text-sm tracking-tight">{t.aiBot}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 opacity-80">Server Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsAiOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-lg focus-visible:bg-white/10 focus:outline-none"
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close AI chat'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${m.role === 'user' ? 'bg-[#0077b6] text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0077b6]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.aiAnalyzing}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.aiPlaceholder}
                  className="flex-1 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
                />
                <button onClick={handleSendMessage} className="w-12 h-12 bg-[#0077b6] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#0077b6]/20 active:scale-90 transition-transform">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsAiOpen(true)}
        aria-expanded={isAiOpen}
        aria-label={t.aiBot}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#0077b6] text-white rounded-[24px] shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-90 transition-all group focus-visible:ring-4 focus-visible:ring-[#0077b6]/50"
      >
        <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Safety Alert Modal */}
      <AnimatePresence>
        {isSafetyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSafetyOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="bg-red-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black">{t.safetyAlert}</h3>
                </div>
                <p className="relative z-10 text-red-50 text-sm font-bold opacity-90 leading-relaxed">
                  {lang === 'bn' 
                    ? 'ঝড় ও বৃষ্টির সময় আপনার নিরাপত্তা আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ।' 
                    : 'Your safety is our top priority during storms and rain.'}
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-xs">১</div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{t.stayAway}</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-xs">২</div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{t.callImmediate}</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center shrink-0 font-black text-xs">৩</div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{t.wetHands}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.emergencyContact}</p>
                  <a 
                    href="tel:16677" 
                    className="flex items-center justify-between p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg shadow-emerald-500/20 group active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-lg font-black tracking-tight">১৬৬৭৭</span>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <button 
                  onClick={() => setIsSafetyOpen(false)}
                  className="w-full py-4 text-sm font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                >
                  {lang === 'bn' ? 'বুঝতে পেরেছি' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside 
        role="navigation" 
        aria-label={lang === 'bn' ? 'প্রধান মেনু' : 'Main Menu'}
        className={`fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-3xl border-r border-white/20 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#0077b6] to-[#00b4d8] rounded-xl flex items-center justify-center shadow-lg shadow-[#0077b6]/20">
                <Zap className="text-white w-6 h-6" fill="white" />
              </div>
              <h1 className="font-black text-xl text-slate-800 leading-tight">BEGUMGANJ<br/><span className="text-[#0077b6]">POWER</span></h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg focus-visible:ring-2 focus-visible:ring-[#0077b6] outline-none" aria-label={lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'}>
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            {[
              { icon: Home, label: t.home, active: true, onClick: () => window.location.reload() },
              { icon: Bell, label: t.alerts, badge: '2', onClick: () => alert(lang === 'bn' ? 'সতর্কতা: বিদ্যুৎ রক্ষণাবেক্ষণ চলছে।' : 'Alert: Power maintenance ongoing.') },
              { icon: Globe, label: t.billCheck, isExternal: true, onClick: () => window.open('https://prepaid.bpdb.gov.bd/', '_blank') },
              { icon: FileText, label: t.pdbNotice, isExternal: true, onClick: () => window.open('https://bpdb.gov.bd/notice-board', '_blank') },
              { icon: Info, label: t.notice, onClick: () => document.getElementById('notice-bar')?.scrollIntoView({ behavior: 'smooth' }) },
              { icon: Settings, label: lang === 'bn' ? 'সেটিংস' : 'Settings', onClick: () => setIsAiOpen(true) },
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={item.onClick}
                aria-current={item.active ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group focus-visible:ring-2 focus-visible:ring-[#0077b6] ${item.active ? 'bg-[#0077b6] text-white shadow-md shadow-[#0077b6]/20' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-[#0077b6]'}`} aria-hidden="true" />
                  <span className="font-bold text-sm text-left">{item.label}</span>
                </div>
                {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" aria-label={`${item.badge} new notifications`}>{item.badge}</span>}
              </button>
            ))}
          </nav>
          
          <div className="mt-4 mb-4">
            <LanguageSwitcher />
          </div>

            <div className="p-4 space-y-4">
              <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-2">Preferences</div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl hover:bg-[#0077b6]/5 transition-colors group cursor-pointer" onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center">
                    {isSoundEnabled ? <Volume2 className="w-5 h-5 text-[#0077b6]" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{lang === 'bn' ? 'সাউন্ড' : 'Sound'}</p>
                    <p className="text-[10px] font-bold text-slate-400">{isSoundEnabled ? 'ON' : 'OFF'}</p>
                  </div>
                </div>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${isSoundEnabled ? 'bg-[#0077b6]' : 'bg-slate-200'}`}>
                  <motion.div animate={{ x: isSoundEnabled ? 18 : 2 }} className="absolute top-1 w-2 h-2 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl hover:bg-[#0077b6]/5 transition-colors group cursor-pointer" onClick={() => setIsBatterySaver(!isBatterySaver)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center">
                    <BatteryMedium className={`w-5 h-5 ${isBatterySaver ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{lang === 'bn' ? 'ব্যাটারি সেভার' : 'Battery Saver'}</p>
                    <p className="text-[10px] font-bold text-slate-400">{isBatterySaver ? 'ACTIVE' : 'INACTIVE'}</p>
                  </div>
                </div>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${isBatterySaver ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <motion.div animate={{ x: isBatterySaver ? 18 : 2 }} className="absolute top-1 w-2 h-2 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>

            <div className="mt-auto p-5 bg-[#0077b6]/5 rounded-3xl border border-[#0077b6]/10">
             <p className="text-[10px] font-bold text-[#0077b6] uppercase mb-2 tracking-widest">{t.developedBy}</p>
             <p className="text-sm font-black text-slate-800">Faisal Kabir Rabi</p>
             <p className="text-[10px] font-medium text-slate-500 mt-1">Full-stack Developer</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        
        {/* Top Floating Header */}
        <header className="sticky top-0 z-30 p-4 xl:p-6 pb-2">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-slate-900/10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-xl">
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-black text-slate-800">{t.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#28a745] animate-pulse"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.realtime} Tracking</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              <div className="text-right hidden xs:block">
                <p className="text-sm font-black text-slate-800">{currentTime.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', {hour: '2-digit', minute:'2-digit'})}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{currentTime.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {day: 'numeric', month: 'short'})}</p>
              </div>
              <button 
                onClick={handleShare}
                aria-label={lang === 'bn' ? 'শেয়ার করুন' : 'Share status'}
                className="w-11 h-11 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-colors shadow-inner focus-visible:ring-2 focus-visible:ring-[#0077b6] focus:outline-none"
              >
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>

              <button 
                onClick={() => setIsSafetyOpen(true)}
                className="relative group focus:outline-none"
                aria-label={t.safetyAlert}
              >
                <div className="absolute -inset-1 bg-red-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-11 h-11 bg-red-50 hover:bg-red-100 rounded-2xl flex items-center justify-center border border-red-100 transition-colors shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </button>

            </div>
          </div>
        </header>

        <main className="flex-1 p-4 xl:p-6 space-y-6 pt-2">
          {/* District-wide Live Status Bar */}
          <div className="bg-slate-900 overflow-hidden py-3 border-y border-white/5 rounded-3xl backdrop-blur-md bg-opacity-95 shadow-lg mb-6">
            <div className="flex items-center px-6 gap-4">
              <div className="flex items-center gap-2 shrink-0 bg-[#0077b6] px-3 py-1 rounded shadow-sm border border-[#00b4d8]/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{t.noakhaliLive}</span>
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                <motion.div 
                  className="flex items-center gap-10 whitespace-nowrap will-change-transform"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    duration: 60, 
                    repeat: Infinity, 
                    ease: "linear",
                    repeatType: "loop"
                  }}
                >
                  {[...districtStatus, ...districtStatus, ...districtStatus].map((city, idx) => (
                    <div key={`${city.id}-${idx}`} className="flex items-center gap-3 group transition-transform hover:scale-105 cursor-default">
                      <span className="text-[11px] font-bold text-white/90 uppercase tracking-tight group-hover:text-[#00b4d8]">
                        {lang === 'bn' ? city.nameBn : city.nameEn}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${city.status === 'on' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${city.status === 'on' ? 'bg-emerald-400' : 'bg-red-400'} ${city.status === 'on' ? 'shadow-[0_0_8px_rgba(52,211,153,0.6)]' : ''}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${city.status === 'on' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {city.status === 'on' ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Dynamic Status Hero Section */}
          <div className="relative">
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-[40px] p-8 xl:p-12 border transition-all duration-700 shadow-2xl ${
                isPowerOn 
                ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 border-emerald-400/30' 
                : 'bg-gradient-to-br from-slate-800 via-slate-900 to-black border-slate-700/50'
              }`}
            >
              {/* Background Glow Decorations */}
              <div className={`absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full -mr-32 -mt-32 transition-colors duration-1000 ${isPowerOn ? 'bg-emerald-400/30' : 'bg-[#0077b6]/20'}`}></div>
              <div className={`absolute bottom-0 left-0 w-64 h-64 blur-[80px] rounded-full -ml-32 -mb-32 transition-colors duration-1000 ${isPowerOn ? 'bg-teal-400/20' : 'bg-red-500/10'}`}></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isPowerOn ? 'bg-emerald-400' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t.realtime} UPDATES</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-4xl xl:text-6xl font-black text-white leading-tight">
                      {isPowerOn ? t.powerOn : t.powerOff}
                    </h2>
                    <p className="text-lg font-bold text-white/70">
                      {isPowerOn ? t.powerOnDuration : t.loadSheddingTimer}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        {isPowerOn ? t.onTime : t.offTime}
                      </p>
                      <div className="text-3xl xl:text-4xl font-black text-white font-mono tabular-nums tracking-wider">
                        {(() => {
                           const diff = Math.floor((currentTime.getTime() - lastPowerStateChange) / 1000);
                           const h = Math.floor(diff / 3600);
                           const m = Math.floor((diff % 3600) / 60);
                           const s = diff % 60;
                           return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                        })()}
                      </div>
                    </div>
                    
                    <div className="h-10 w-px bg-white/10 hidden sm:block"></div>

                  <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { togglePower(); triggerHaptic(); }}
                      className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${
                        isPowerOn 
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                        : 'bg-[#0077b6] hover:bg-[#00b4d8] text-white shadow-[#0077b6]/30'
                      }`}
                    >
                      {isPowerOn ? (lang === 'bn' ? 'লোডশেডিং রিপোর্ট করুন' : 'Report Loadshedding') : (lang === 'bn' ? 'বিদ্যুৎ এসেছে?' : 'Power Restored?')}
                    </motion.button>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="relative">
                    {/* Animated Power Icon */}
                    <AnimatePresence mode="wait">
                      {isPowerOn ? (
                        <motion.div 
                          key="on-anim"
                          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          className="relative"
                        >
                          {/* Rotating Rings */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                            className="absolute -inset-10 border-2 border-dashed border-emerald-400/20 rounded-full"
                          ></motion.div>
                          <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                            className="absolute -inset-20 border border-emerald-400/10 rounded-full"
                          ></motion.div>

                          {/* Central Pulse */}
                          <div className="relative z-10 w-40 h-40 xl:w-56 xl:h-56 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-2xl rounded-full border border-white/30 flex items-center justify-center shadow-2xl">
                             <motion.div 
                               animate={{ 
                                 scale: [1, 1.2, 1],
                                 opacity: [0.5, 0.8, 0.5]
                               }}
                               transition={{ repeat: Infinity, duration: 2 }}
                               className="absolute inset-0 bg-emerald-400/30 rounded-full blur-2xl"
                             ></motion.div>
                             <Zap className="w-20 h-20 xl:w-28 xl:h-28 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" fill="white" />
                          </div>

                          {/* "Floating" Orbs */}
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                y: [-10, 10, -10],
                                x: [-5, 5, -5]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 3 + i, 
                                ease: "easeInOut",
                                delay: i * 0.5
                              }}
                              className={`absolute w-4 h-4 bg-emerald-300 rounded-full blur-sm opacity-50`}
                              style={{ 
                                top: `${20 + i * 30}%`, 
                                right: `${-10 + i * 20}%` 
                              }}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="off-anim"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          className="relative"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-40 h-40 xl:w-56 xl:h-56 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center relative">
                               <motion.div 
                                 animate={{ opacity: [0.2, 0.4, 0.2] }}
                                 transition={{ repeat: Infinity, duration: 4 }}
                                 className="absolute inset-0 bg-slate-400/10 rounded-full"
                               ></motion.div>
                               <Clock className="w-20 h-20 xl:w-28 xl:h-28 text-slate-500" />
                            </div>
                            <div className="mt-6 flex gap-2">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.5, 
                                    delay: i * 0.3 
                                  }}
                                  className="w-2 h-2 bg-[#0077b6] rounded-full"
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Smart Predictive Alert */}
          <AnimatePresence>
            {(showPredictiveAlert || isAiPredicting) && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${aiPrediction && aiPrediction.probability >= 50 ? 'from-amber-500 to-orange-600' : 'from-indigo-500 to-blue-600'} rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000`}></div>
                <div className={`relative bg-black/40 backdrop-blur-3xl border ${aiPrediction && aiPrediction.probability >= 50 ? 'border-amber-500/30' : 'border-indigo-500/30'} rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl overflow-hidden`}>
                  
                  <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                    <div className={`w-16 h-16 ${aiPrediction && aiPrediction.probability >= 50 ? 'bg-amber-500/20' : 'bg-indigo-500/20'} rounded-2xl flex items-center justify-center shrink-0 border border-white/10`}>
                      {isAiPredicting ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          {aiPrediction && aiPrediction.probability >= 50 ? (
                            <ZapOff className="w-8 h-8 text-amber-400" />
                          ) : (
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                          )}
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <h4 className={`text-lg font-black uppercase tracking-tighter ${aiPrediction && aiPrediction.probability >= 50 ? 'text-amber-400' : 'text-indigo-400'}`}>
                          {isAiPredicting ? (lang === 'bn' ? 'এআই গ্রিড বিশ্লেষণ চলছে...' : 'AI Grid Analysis In Progress...') : (t.predictiveTitle)}
                        </h4>
                        {!isAiPredicting && aiPrediction && (
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${aiPrediction.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                             {aiPrediction.confidence} confidence
                           </span>
                        )}
                      </div>
                      
                      <p className="text-sm font-medium text-white/80 leading-relaxed max-w-2xl">
                        {isAiPredicting 
                          ? (lang === 'bn' ? 'আপনার এলাকার ঐতিহাসিক লোড ডেটা এবং আবহাওয়ার তথ্য বিশ্লেষণ করা হচ্ছে...' : 'Analyzing historical load data and weather patterns for your area...') 
                          : (aiPrediction 
                              ? (lang === 'bn' ? aiPrediction.reasonBn : aiPrediction.reasonEn)
                              : t.predictiveText
                            )
                        }
                      </p>

                      {aiPrediction && !isAiPredicting && (
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{lang === 'bn' ? 'সম্ভাবনা' : 'Probability'}:</span>
                            <span className={`text-xs font-black ${aiPrediction.probability >= 70 ? 'text-red-400' : 'text-emerald-400'}`}>{aiPrediction.probability}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{lang === 'bn' ? 'সময়' : 'Timing'}:</span>
                            <span className="text-xs font-black text-white">{aiPrediction.estimatedTime}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => runAiPrediction()}
                      disabled={isAiPredicting}
                      className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all disabled:opacity-50"
                      title={lang === 'bn' ? 'এআই রিস্ক চেক করুন' : 'AI Risk Check'}
                    >
                      <RefreshCw className={`w-5 h-5 ${isAiPredicting ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setShowPredictiveAlert(false)}
                      className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      {lang === 'bn' ? 'ঠিক আছে' : 'Acknowledge'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Device Health Score Widget (Neo-Brutalism Style) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-2xl border-4 border-white/5 rounded-none p-8 flex flex-col relative overflow-hidden shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-tighter uppercase">{t.deviceHealth}</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Protection Active</p>
                </div>
                <div className="w-12 h-12 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-end gap-2 mb-6">
                 <span className="text-6xl font-black text-white tracking-tighter">{deviceHealthScore}</span>
                 <span className="text-sm font-bold text-emerald-400 mb-2">/ 100</span>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40">Status</span>
                    <span className="text-emerald-400">Stable</span>
                 </div>
                 <div className="h-2 bg-white/5 border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${deviceHealthScore}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                 </div>
              </div>

              {fluctuationCount > 5 && (
                <div className="mt-6 p-4 bg-red-500/20 border-2 border-red-500/30">
                  <p className="text-xs font-bold text-red-100 leading-relaxed">
                    <span className="text-red-400 font-black">HIGH RISK:</span> {t.safetyWarning}
                  </p>
                </div>
              )}
              
              <p className="mt-6 text-xs font-medium text-white/40 leading-relaxed">
                {t.deviceHealthDesc}
              </p>
            </motion.div>
            
            {/* Power Quality Score Widget */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0077b6]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-8">{t.powerQuality}</h3>
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                   <motion.circle 
                      cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className="text-[#0077b6] drop-shadow-[0_0_8px_rgba(0,119,182,1)]"
                      strokeDasharray="553"
                      initial={{ strokeDashoffset: 553 }}
                      animate={{ strokeDashoffset: 553 - (553 * powerQualityScore) / 100 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white">{powerQualityScore}%</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Excellent</span>
                 </div>
              </div>

              <div className="mt-8 flex items-center gap-4 w-full p-4 bg-white/5 rounded-2xl border border-white/10">
                 <Thermometer className="w-5 h-5 text-[#0077b6]" />
                 <p className="text-xs font-bold text-white/60">{t.voltageGuide}</p>
              </div>
            </motion.div>

            {/* Energy Savings Advisor */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#003459] to-[#00171f] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#0077b6]/20 rounded-full blur-[80px] -mr-24 -mb-24"></div>
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <BarChart3 className="w-5 h-5 text-[#00b4d8]" />
                 </div>
                 <h3 className="text-xl font-black text-white tracking-tight">{t.energyAdvisor}</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 group-hover:border-[#00b4d8]/30 transition-colors">
                   <div className="flex items-center gap-2 text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">{t.peakHourAlert}</span>
                   </div>
                   <p className="text-sm font-medium text-white/70 leading-relaxed">{t.peakHourText}</p>
                </div>

                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                   <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap className="w-4 h-4 fill-current" />
                   </div>
                   <p className="text-sm font-medium text-white/70 leading-relaxed">{t.ledSaving}</p>
                </div>
              </div>

              <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                 {lang === 'bn' ? 'আরও টিপস দেখুন' : 'View Full Guide'}
              </button>
            </motion.div>

            {/* Live News Feed (Community Aradda & Official) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-white tracking-tight">{t.digitalAdda}</h3>
                 <div className="flex items-center gap-2">
                    {isLoadingNews && <Loader2 className="w-3 h-3 text-[#0077b6] animate-spin" />}
                    <span className="text-[10px] font-black text-[#0077b6] uppercase tracking-widest bg-[#0077b6]/10 px-3 py-1 rounded-full border border-[#0077b6]/20">Live Official</span>
                 </div>
              </div>

              <div className="flex-1 space-y-6">
                {(officialNews.length > 0 ? officialNews : newsPosts).map((post: any) => (
                  <a 
                    key={post.id} 
                    href={post.link || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block pb-6 border-b border-white/5 last:border-0 group cursor-pointer no-underline"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${post.category === 'maintenance' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#0077b6]/20 text-[#00b4d8]'}`}>
                        {post.category || 'News'}
                      </span>
                      {post.isAuthentic && (
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Verified Source</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white group-hover:text-[#00b4d8] transition-colors leading-relaxed mb-2">
                      {lang === 'bn' ? (post.titleBn || post.title) : (post.titleEn || post.title)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{post.source || 'Local'} • {post.date || post.time}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-[#00b4d8] transition-colors" />
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-[#0077b6]/20 to-transparent rounded-2xl border border-white/5 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <Globe className="w-4 h-4 text-white/60" />
                 </div>
                 <p className="text-xs font-bold text-white/60">{t.noakhaliNews}</p>
              </div>
            </motion.div>

            {/* PDB Official Notice Board Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border-4 border-slate-100 rounded-none p-8 flex flex-col relative overflow-hidden group shadow-[10px_10px_0px_0px_rgba(241,245,249,1)]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{t.pdbNotice}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Source</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-[#0077b6] rounded-xl border-2 border-slate-100">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm font-medium text-slate-500 leading-relaxed flex-1 mb-8">
                {t.officialUpdates}
              </p>

              <a 
                href="https://bpdb.gov.bd/notice-board" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#0077b6] transition-colors"
              >
                {t.visitPdb}
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Solar & IPS Advisor */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#003459] border-4 border-[#0077b6]/30 rounded-none p-8 shadow-[10px_10px_0px_0px_rgba(0,119,182,0.3)] relative overflow-hidden group"
            >
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 border-2 border-white/20 flex items-center justify-center bg-white/5">
                    <SunMoon className="w-6 h-6 text-[#00b4d8]" />
                 </div>
                 <h3 className="text-xl font-black text-white tracking-tighter uppercase">{t.solarIps}</h3>
              </div>

              <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.ipsTimer}</span>
                      <span className="text-xs font-black text-[#00b4d8]">~4h 20m remaining</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border-2 border-white/10">
                         <p className="text-[8px] font-black text-white/40 uppercase mb-1">Load (Watts)</p>
                         <p className="text-xl font-black text-white">200W</p>
                      </div>
                      <div className="p-4 bg-white/5 border-2 border-white/10">
                         <p className="text-[8px] font-black text-white/40 uppercase mb-1">Battery</p>
                         <p className="text-xl font-black text-[#00b4d8]">85%</p>
                      </div>
                   </div>
                </div>

                <button className="w-full py-4 border-2 border-white/10 hover:border-[#00b4d8] text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                   Find Local Technicians
                </button>
              </div>
            </motion.div>

            {/* Expatriate Home Monitor */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-2xl border-4 border-white/5 rounded-none p-8 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] flex flex-col group"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase">{t.homeMonitor}</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">For Expats / Remitees</p>
                 </div>
                 <div className="w-12 h-12 border-2 border-[#0077b6]/30 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#0077b6] animate-pulse" />
                 </div>
              </div>

              <div className="flex-1 space-y-6">
                 <div className="space-y-3">
                   <p className="text-xs font-bold text-white/60">{t.meterInput}</p>
                   <div className="relative">
                      <input 
                        type="text" 
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
                        className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-black tracking-widest focus:border-[#0077b6] outline-none" 
                        placeholder="M-0XXXXX" 
                      />
                      <Search className="absolute right-4 top-4 w-5 h-5 text-white/20" />
                   </div>
                 </div>

                 {meterNumber && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 bg-[#0077b6]/20 border-2 border-[#0077b6]/30 space-y-4"
                    >
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Current Status</span>
                          <span className="px-2 py-1 bg-emerald-500 text-[10px] font-black text-white uppercase tracking-widest">Active</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase mb-1">Last Balance</p>
                             <p className="text-2xl font-black text-white">৳ ১২৪০.৫০</p>
                          </div>
                          <p className="text-[10px] font-bold text-white/30 mb-1">Updated 1h ago</p>
                       </div>
                    </motion.div>
                 )}
              </div>
            </motion.div>

          </div>

          {/* Power Quality History Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0077b6]/20 rounded-xl flex items-center justify-center border border-[#0077b6]/20">
                    <History className="w-5 h-5 text-[#0077b6]" />
                  </div>
                  {lang === 'bn' ? 'পাওয়ার কোয়ালিটি ইতিহাস' : 'Power Quality History'}
                </h3>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{lang === 'bn' ? 'বিগত দিনের পারফরম্যান্স এনালাইসিস' : 'Performance analysis over time'}</p>
              </div>

              <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-2xl gap-1 border border-white/10 shrink-0">
                {[
                  { id: '7d', label: lang === 'bn' ? '৭ দিন' : '7 Days' },
                  { id: '30d', label: lang === 'bn' ? '৩০ দিন' : '30 Days' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => { setQualityHistoryRange(range.id as any); triggerHaptic(); }}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      qualityHistoryRange === range.id 
                      ? 'bg-[#0077b6] text-white shadow-lg shadow-[#0077b6]/20' 
                      : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={qualityHistoryData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0077b6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0077b6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `Day ${val}`}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[60, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0077b6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Avg Score</p>
                  <p className="text-xl font-black text-white">86.4%</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Peak Voltage</p>
                  <p className="text-xl font-black text-white">232V</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Stability</p>
                  <p className="text-xl font-black text-emerald-400">High</p>
               </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center p-8 bg-gradient-to-r from-transparent via-[#0077b6]/10 to-transparent">
             <button 
              onClick={() => { setIsReportingOpen(true); triggerHaptic(); }}
              className="group flex flex-col items-center gap-4 py-8 px-12 border-4 border-dashed border-white/10 hover:border-[#0077b6] hover:bg-white/5 transition-all w-full max-w-4xl"
             >
                <div className="w-20 h-20 border-4 border-[#0077b6] flex items-center justify-center bg-white/5 group-hover:shadow-[8px_8px_0px_0px_rgba(0,119,182,1)] duration-300">
                   <Ear className="w-10 h-10 text-[#0077b6]" />
                </div>
                <div className="text-center">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-[#00b4d8]">{t.anonymousReport}</h3>
                   <p className="text-sm font-bold text-white/40">{t.reportIssue}</p>
                </div>
             </button>
          </div>

          {/* Important Notice Bar */}
          <div 
            id="notice-bar" 
            role="region" 
            aria-label="Important Notice"
            className="bg-[#0077b6]/85 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-xl shadow-[#0077b6]/20 relative overflow-hidden group border border-white/20"
          >
            <div className="absolute right-0 top-0 h-full w-32 bg-white/10 skew-x-[-20deg] translate-x-20 transition-transform group-hover:translate-x-10"></div>
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
               <Bell className="text-white w-5 h-5 animate-ring" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden relative h-full flex flex-col justify-center">
               <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1 relative z-10 bg-[#0077b6] pr-4 self-start">Emergency Notice</p>
               <div className="relative overflow-hidden w-full h-6">
                  <motion.div
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 20, 
                      ease: "linear" 
                    }}
                    className="absolute whitespace-nowrap flex items-center"
                  >
                    <span className="text-sm font-bold text-white pr-10">
                      {lang === 'bn' ? 'সম্মানিত গ্রাহকবৃন্দ, লাইনে মেরামতের সুবিধার জন্য আজ দুপুর ২:০০ থেকে ৪:০০ পর্যন্ত বিদ্যুৎ সরবরাহ বন্ধ থাকতে পারে।' : 'Dear customers, due to line maintenance, power supply might be off today from 02:00 PM to 04:00 PM.'}
                    </span>
                    <span className="text-sm font-bold text-white pr-10 opacity-50">✦</span>
                    <span className="text-sm font-bold text-white pr-10">
                      {lang === 'bn' ? 'জরুরি প্রয়োজনে নিচের মেইনটেন্যান্স কাজগুলো খেয়াল করুন।' : 'Check maintenance updates below for more details.'}
                    </span>
                  </motion.div>
               </div>
            </div>
            <ChevronRight className="text-white/40 w-5 h-5 hidden sm:block relative z-10 bg-[#0077b6] pl-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status Card (Double Width) */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-2xl rounded-2xl p-6 xl:p-8 border border-white/50 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#0077b6]/5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
               
               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                 <div>
                   <h3 className="text-xl xl:text-2xl font-bold text-slate-800">{t.powerStatus}</h3>
                   <div className="flex items-center gap-3 mt-1.5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {t.lastUpdate}: {Math.max(0, Math.floor((Date.now() - lastCheckedTime) / 60000))} {lang === 'bn' ? 'মিনিট আগে' : 'min ago'}
                     </p>
                     <button 
                       onClick={handleRefresh}
                       disabled={isRefreshing}
                       className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0077b6] rounded-full transition-all active:scale-95 disabled:opacity-50"
                     >
                       <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                       <span className="text-[10px] font-bold uppercase tracking-tight">
                         {isRefreshing ? t.fetching : t.refreshData}
                       </span>
                     </button>
                   </div>
                 </div>
                 <button 
                  onClick={togglePower}
                  aria-pressed={isPowerOn}
                  className={`w-full sm:w-auto px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg focus-visible:ring-4 focus:outline-none ${isPowerOn ? 'bg-[#28a745] text-white shadow-[#28a745]/20 focus-visible:ring-[#28a745]/50' : 'bg-[#d9534f] text-white shadow-[#d9534f]/20 focus-visible:ring-[#d9534f]/50'}`}
                 >
                   {isPowerOn ? t.powerOn : t.powerOff}
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{t.voltage}</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-800">২২৮</span>
                        <span className="text-[10px] font-bold text-slate-400">V</span>
                     </div>
                   </div>
                   <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{lang === 'bn' ? 'ফ্রিকোয়েন্সি' : 'Frequency'}</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-800">৪৯.৮</span>
                        <span className="text-[10px] font-bold text-slate-400">Hz</span>
                     </div>
                   </div>
                 </div>
                 <div className="p-6 bg-[#28a745]/5 rounded-3xl border border-[#28a745]/10 flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#28a745]/10 rounded-2xl flex items-center justify-center shrink-0">
                       <Zap className="w-8 h-8 text-[#28a745]" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-[#28a745] uppercase">{lang === 'bn' ? 'সিস্টেম লোড' : 'System Load'}</p>
                       <p className="text-xl font-black text-slate-800">স্বাভাবিক (Normal)</p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Weather & Alert Sidebar */}
            <div className="flex flex-col gap-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert(lang === 'bn' ? 'বৃষ্টির সম্ভাবনা: ৮০%। নিরাপদ আশ্রয় নিন।' : 'Precipitation Chance: 80%. Take shelter.')}
                aria-label={lang === 'bn' ? 'আবহাওয়া অ্যাপলার্ট: বৃষ্টির সম্ভাবনা: ৮০%' : 'Weather Alert: Precipitation Chance: 80%'}
                className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 border border-white/50 shadow-2xl grow flex flex-col cursor-pointer transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-left w-full focus-visible:ring-2 focus-visible:ring-[#0077b6]"
              >
                <div className="flex items-center justify-between mb-6 w-full">
                  <h3 className="text-lg font-bold text-slate-800">{t.currentWeather}</h3>
                  <CloudRain className="w-6 h-6 text-[#0077b6]" aria-hidden="true" />
                </div>
                
                <div className="flex items-center justify-between mb-8 w-full">
                  <div>
                    <p className="text-5xl font-black text-slate-800">৩২°</p>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{lang === 'bn' ? 'বজ্রপাতসহ বৃষ্টি' : 'Rain with Lightning'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Thermometer className="w-3 h-3" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t.humidity}</span>
                    </div>
                    <p className="text-sm font-black text-slate-700">৮৪%</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Wind className="w-3 h-3" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t.wind}</span>
                    </div>
                    <p className="text-sm font-black text-slate-700">{lang === 'bn' ? '১২ কিমি/ঘণ্টা' : '12 km/h'}</p>
                  </div>
                </div>
              </motion.button>

              {/* Safety Pro-Tips Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-[#0077b6]/90 to-[#023e8a]/90 backdrop-blur-xl rounded-2xl p-6 text-white shadow-xl flex flex-col relative overflow-hidden group border border-white/20"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black">{t.proTips}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <p className="text-xs font-bold leading-relaxed opacity-90">{t.stormSafety}</p>
                  </div>
                  <button 
                    onClick={() => setIsSafetyOpen(true)}
                    className="w-full py-3 bg-white text-[#0077b6] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg active:scale-95"
                  >
                    {lang === 'bn' ? 'আরও জানুন' : 'Learn More'}
                  </button>
                </div>
              </motion.div>

              {/* Lightning Alert */}
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 p-5 rounded-3xl border border-red-100 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                    <CloudLightning className="w-6 h-6 text-red-600 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-700">{t.lightningAlert}</h4>
                    <p className="text-[10px] text-red-600 font-medium leading-normal mt-0.5">{t.lightningText}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Maintenance Updates Bar */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 xl:p-8 border border-white/50 shadow-2xl grow flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-amber-500 animate-spin-slow" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{t.maintenanceUpdate}</h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full">{maintenanceWorks.length} Work Active</span>
            </div>

            <div className="space-y-3">
              {maintenanceWorks.map((work, idx) => (
                <button 
                  key={idx} 
                  onClick={() => alert(`${work.location}: ${work.type}`)}
                  className="flex items-center justify-between w-full p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-slate-100 cursor-pointer transition-all active:scale-[0.98] group text-left focus-visible:ring-2 focus-visible:ring-[#0077b6]"
                  aria-label={`${work.location}: ${work.type}, ${work.status}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-amber-400 rounded-full group-hover:scale-y-110 transition-transform"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{work.location}</p>
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{work.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-amber-600 uppercase mb-1">{work.status}</p>
                    <p className="text-[10px] font-bold text-slate-400">{work.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Interactive Area Map */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 xl:p-8 border border-white/50 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg xl:text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-xl">🗺️</span> {t.areaStatus}
                </h3>
                <div className="flex bg-slate-900/5 backdrop-blur-md p-1 rounded-xl gap-1 border border-white/20" role="group" aria-label={lang === 'bn' ? 'এলাকা ফিল্টার করুন' : 'Filter areas'}>
                   <button onClick={() => { setAreaFilter('all'); triggerHaptic(); }} aria-pressed={areaFilter === 'all'} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#0077b6] focus:outline-none ${areaFilter === 'all' ? 'bg-white/90 text-[#0077b6] shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>{t.allAreas}</button>
                   <button onClick={() => { setAreaFilter('on'); triggerHaptic(); }} aria-pressed={areaFilter === 'on'} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#28a745] focus:outline-none ${areaFilter === 'on' ? 'bg-[#28a745]/90 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>{lang === 'bn' ? 'বিদ্যুৎ আছে' : 'On'}</button>
                   <button onClick={() => { setAreaFilter('off'); triggerHaptic(); }} aria-pressed={areaFilter === 'off'} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#d9534f] focus:outline-none ${areaFilter === 'off' ? 'bg-[#d9534f]/90 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>{lang === 'bn' ? 'নেই' : 'Off'}</button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(areaStatuses)
                  .filter(([_, isAreaOn]) => {
                    if (areaFilter === 'on') return isAreaOn;
                    if (areaFilter === 'off') return !isAreaOn;
                    return true;
                  })
                  .map(([areaName, isAreaOn]) => (
                    <motion.div 
                      key={areaName} 
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${isAreaOn ? 'bg-[#28a745]/5 border-[#28a745]/10 hover:bg-[#28a745]/10' : 'bg-[#d9534f]/5 border-[#d9534f]/10 hover:bg-[#d9534f]/10'}`}
                    >
                      <span className={`text-xs font-bold ${isAreaOn ? 'text-slate-700' : 'text-[#d9534f]'}`}>{areaName}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${isAreaOn ? 'bg-[#28a745] animate-pulse' : 'bg-[#d9534f]'}`}></div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Volunteer/Community Report */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 xl:p-8 border border-white/50 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#0077b6]/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
               <div className="flex flex-col gap-6 relative z-10 w-full">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-xl">📢</span> {t.communityUpdate}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{lang === 'bn' ? 'আপনার এলাকার বর্তমান অবস্থা জানান' : 'Tell your area status'}</p>
                </div>

                {reportStatus ? (
                  <div className="bg-[#28a745]/10 text-[#28a745] border border-[#28a745]/20 font-bold px-5 py-4 rounded-3xl text-sm flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {lang === 'bn' ? 'আপডেট দেওয়ার জন্য ধন্যবাদ!' : 'Thanks for the update!'}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <select 
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0077b6] cursor-pointer"
                    >
                      {Object.keys(areaStatuses).map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { 
                          triggerHaptic();
                          setReportStatus('on'); 
                          setAreaStatuses(prev => ({...prev, [selectedArea]: true}));
                          addToast(lang === 'bn' ? `${selectedArea} এলাকায় বিদ্যুৎ আছে বলে রিপোর্ট করা হয়েছে` : `Reported: Power is ON in ${selectedArea}`, 'success');
                          setTimeout(() => setReportStatus(null), 3000); 
                        }} 
                        className="flex-1 bg-white/60 backdrop-blur-md border-2 border-[#28a745]/30 text-[#28a745] hover:bg-[#28a745] hover:text-white transition-all text-sm font-black py-4 rounded-2xl shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-[#28a745]"
                      >
                        {lang === 'bn' ? 'বিদ্যুৎ আছে' : 'POWER ON'}
                      </button>
                      <button 
                        onClick={() => { 
                          triggerHaptic();
                          setReportStatus('off'); 
                          setAreaStatuses(prev => ({...prev, [selectedArea]: false}));
                          addToast(lang === 'bn' ? `${selectedArea} এলাকায় বিদ্যুৎ নেই বলে রিপোর্ট করা হয়েছে` : `Reported: Power is OFF in ${selectedArea}`, 'error');
                          setTimeout(() => setReportStatus(null), 3000); 
                        }} 
                        className="flex-1 bg-white/60 backdrop-blur-md border-2 border-[#d9534f]/30 text-[#d9534f] hover:bg-[#d9534f] hover:text-white transition-all text-sm font-black py-4 rounded-2xl shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-[#d9534f]"
                      >
                        {lang === 'bn' ? 'চলে গেছে' : 'POWER OFF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Maintenance Overview Section */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 xl:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10 relative z-10">
              <div className="space-y-2">
                <h3 className="text-2xl xl:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <span className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <Settings className="w-6 h-6 text-amber-500 animate-[spin_4s_linear_infinite]" />
                  </span> 
                  {t.maintenanceUpdate}
                </h3>
                <p className="text-sm font-medium text-white/40">{t.crewLocation} <span className="text-amber-400">বেগমগঞ্জ পবিস-৩ দল</span></p>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span className="text-xs font-black text-white uppercase tracking-widest">Live Updates</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
               {maintenanceWorks.map((work, idx) => (
                 <motion.div 
                   key={idx}
                   whileHover={{ x: 5 }}
                   className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center gap-6 group hover:border-[#0077b6]/30 transition-all shadow-xl"
                 >
                    <div className="w-14 h-14 bg-[#0077b6]/20 rounded-2xl flex items-center justify-center border border-[#0077b6]/20 shrink-0">
                       <MapPin className="w-6 h-6 text-[#0077b6]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-lg font-black text-white group-hover:text-[#00b4d8] transition-colors">{work.location}</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-white/50">{work.type}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md ${work.status === 'work-ongoing' || work.status === 'কাজ চলছে' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                           {work.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Expected Restore</p>
                       <p className="text-xl font-black text-white font-mono tracking-wider">{work.time}</p>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-br from-[#0077b6]/10 to-transparent border border-white/10 rounded-3xl">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                       <img src="https://ui-avatars.com/api/?name=Line+Man&background=0077b6&color=fff" alt="Lineman" className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="text-sm font-black text-white">{lang === 'bn' ? 'মিস্টার মোস্তফা (লাইনম্যান প্রধান)' : 'Mr. Mostafa (Line Foreman)'}</p>
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{lang === 'bn' ? 'খোয়াজপুর সাব-ডিভিশন' : 'Khoyazpur Sub-division'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none px-6 py-3 bg-[#0077b6] hover:bg-[#00b4d8] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#0077b6]/20">
                       {lang === 'bn' ? 'টিমের সাথে আলাপ করুন' : 'Contact Crew'}
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all">
                       <Search className="w-5 h-5" />
                    </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Substations Overview Section */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 xl:p-8 border border-white/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <h3 className="text-xl xl:text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-xl">🏭</span> {t.substationUpdate}
              </h3>
              <span className="font-bold text-xs bg-[#0077b6]/10 text-[#0077b6] px-4 py-2 rounded-full flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#0077b6]"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0077b6]"></span>
                 </span>
                {t.liveSyncing}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {substations.map((sub) => {
                 const load = isPowerOn ? sub.baseLoad : 0.0;
                 const isOverloaded = load > 6.0;
                 const status = !isPowerOn ? (lang === 'bn' ? 'লোড ক্লিয়ারেন্স / অফ' : 'Load Clearance / Off') : (isOverloaded ? (lang === 'bn' ? 'ওভারলোড' : 'Overload') : (lang === 'bn' ? 'স্বাভাবিক' : 'Normal'));
                 
                 return (
                   <div key={sub.id} className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-white/30 flex flex-col hover:shadow-xl transition-all group shadow-sm">
                     <div className="flex justify-between items-start mb-6">
                       <div>
                         <h4 className="font-bold text-lg text-slate-800">{lang === 'bn' ? sub.name : sub.name.replace('সাবস্টেশন', 'Substation')}</h4>
                         <p className="text-xs font-bold text-[#0077b6] mt-1">{sub.capacity}</p>
                       </div>
                     </div>
                     
                     <div className="flex bg-white rounded-2xl border border-slate-100 p-4 mb-6 items-center justify-between shadow-sm">
                       <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t.currentLoad}</span>
                         <span className={`text-2xl font-black ${load > 0 ? (isOverloaded ? 'text-amber-500' : 'text-[#0077b6]') : 'text-slate-400'}`}>
                           {load.toFixed(1)} <span className="text-xs">{lang === 'bn' ? 'মে.ও' : 'MW'}</span>
                         </span>
                       </div>
                       <div className="w-px h-10 bg-slate-100"></div>
                       <div className="flex flex-col text-right">
                           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t.maxCapacity}</span>
                           <span className="text-lg font-bold text-slate-600">{sub.maxLoad.toFixed(1)} <span className="text-xs">MW</span></span>
                       </div>
                     </div>
                     
                     <div className="mt-auto pt-4 border-t border-slate-200/60">
                       <p className="text-xs text-slate-500 leading-relaxed">
                         <span className="font-bold text-slate-700">{t.feeders}:</span> {sub.feeders}
                       </p>
                     </div>
                   </div>
                 );
              })}
            </div>

            <div className="border-t border-slate-100 pt-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-xl">📈</span> {t.historyData}
                </h4>
                <div className="flex bg-slate-900/5 backdrop-blur-md p-1 rounded-2xl gap-1 border border-white/20" role="group" aria-label={lang === 'bn' ? 'সময়সীমা নির্বাচন করুন' : 'Select time range'}>
                  {[
                    { id: '3h', label: lang === 'bn' ? '৩ ঘণ্টা' : '3h' },
                    { id: '12h', label: lang === 'bn' ? '১২ ঘণ্টা' : '12h' },
                    { id: '24h', label: lang === 'bn' ? '২৪ ঘণ্টা' : '24h' },
                    { id: '7d', label: lang === 'bn' ? '৭ দিন' : '7d' }
                  ].map((range) => (
                     <button
                       key={range.id}
                       onClick={() => { setHistoryRange(range.id as any); triggerHaptic(); }}
                       aria-pressed={historyRange === range.id}
                       className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-[#0077b6] focus:outline-none active:scale-95 ${
                         historyRange === range.id 
                         ? 'bg-white/90 text-[#0077b6] shadow-sm' 
                         : 'text-slate-600 hover:text-slate-800'
                       }`}
                     >
                       {range.label}
                     </button>
                  ))}
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => val.toFixed(1)}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 'bold', paddingTop: '20px' }} />
                    <Line type="monotone" name={lang === 'bn' ? 'চৌমুহনী' : 'Choumuhani'} dataKey="চৌমুহনী" stroke="#0077b6" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                    <Line type="monotone" name={lang === 'bn' ? 'বেগমগঞ্জ-১' : 'Begumganj-1'} dataKey="বেগমগঞ্জ-১" stroke="#f59e0b" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                    <Line type="monotone" name={lang === 'bn' ? 'ছয়ানী' : 'Chayani'} dataKey="ছয়ানী" stroke="#10b981" strokeWidth={4} dot={false} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Today's Report Table */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-2xl p-6 xl:p-8 border border-white/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="text-xl xl:text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-xl">📊</span> {t.todayReport}
              </h3>
              <span className="font-bold text-sm bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl">
                {t.totalLoadShedding}: <span className="font-black">{lang === 'bn' ? '০৩ ঘণ্টা ২০ মিনিট' : '03h 20m'}</span>
              </span>
            </div>
            
            <div className="overflow-x-auto rounded-[24px] border border-slate-100">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-[#f8fafc] text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-5 border-b border-slate-100">{lang === 'bn' ? 'এলাকা' : 'Area'}</th>
                    <th className="px-6 py-5 border-b border-slate-100">{lang === 'bn' ? 'বিদ্যুৎ গিয়েছে' : 'Outage'}</th>
                    <th className="px-6 py-5 border-b border-slate-100">{lang === 'bn' ? 'বিদ্যুৎ এসেছে' : 'Restored'}</th>
                    <th className="px-6 py-5 border-b border-slate-100">{lang === 'bn' ? 'মোট সময়' : 'Duration'}</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600">
                  {dailyReport.map((report, idx) => (
                    <motion.tr 
                      key={idx} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                    >
                      <td className="px-6 py-5 font-bold text-slate-800">{report.area}</td>
                      <td className={`px-6 py-5 font-bold ${report.offTime !== '—' ? 'text-red-500' : 'text-slate-400'}`}>{report.offTime}</td>
                      <td className={`px-6 py-5 font-bold ${report.onTime !== '—' ? 'text-emerald-500' : 'text-slate-400'}`}>{report.onTime}</td>
                      <td className="px-6 py-5 font-black text-slate-800">{report.duration}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clean Footer */}
          <footer className="footer flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-black py-10 border-t border-slate-100 gap-6">
            <span>&copy; {new Date().getFullYear()} {t.title}</span>
            <div className="flex gap-8">
              <span className="cursor-pointer hover:text-[#0077b6] transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-[#0077b6] transition-colors">Terms of Use</span>
            </div>
            <span>{t.developedBy}: <span className="text-slate-800 font-black underline decoration-[#0077b6] decoration-2 underline-offset-4 pointer-events-none">Faisal Kabir Rabi</span></span>
          </footer>

        </main>
      </div>

      {/* iOS Style Floating Toasts */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="w-full pointer-events-auto"
            >
              <div className={`
                relative overflow-hidden
                px-6 py-4 rounded-[28px] 
                bg-white/70 backdrop-blur-2xl 
                border border-white/40 
                shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                flex items-center gap-4
              `}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-600' :
                  toast.type === 'error' ? 'bg-red-500/20 text-red-600' :
                  'bg-[#0077b6]/20 text-[#0077b6]'
                }`}>
                  {toast.type === 'success' ? <Zap className="w-5 h-5 fill-current" /> :
                   toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                   <RefreshCw className="w-5 h-5" />}
                </div>
                <p className="text-sm font-black text-slate-800 leading-tight">
                  {toast.message}
                </p>
                <div className="absolute bottom-0 left-0 h-1 bg-slate-200/20 w-full">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    className={`h-full ${
                      toast.type === 'success' ? 'bg-emerald-500' :
                      toast.type === 'error' ? 'bg-red-500' :
                      'bg-[#0077b6]'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
