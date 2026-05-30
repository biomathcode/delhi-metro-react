/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'bn';

type TranslationKey =
  | 'language'
  | 'english'
  | 'hindi'
  | 'marathi'
  | 'bengali'
  | 'theme'
  | 'switchToLightTheme'
  | 'switchToDarkTheme'
  | 'lightTheme'
  | 'darkTheme'
  | 'fromStation'
  | 'toStation'
  | 'planJourney'
  | 'useSmoothRouteAnimation'
  | 'smoothRouteAnimation'
  | 'stepRouteAnimation'
  | 'smooth'
  | 'step'
  | 'cinematicExportZoom'
  | 'swapFromAndToStations'
  | 'swapStations'
  | 'chooseRoute'
  | 'routeTitle'
  | 'routeOptions'
  | 'routeOption'
  | 'recommended'
  | 'directRoute'
  | 'viaStation'
  | 'moreInterchanges'
  | 'sortRoutes'
  | 'sortByInterchanges'
  | 'sortByStops'
  | 'playRoute'
  | 'routePlanner'
  | 'delhiMetro'
  | 'fare'
  | 'stops'
  | 'time'
  | 'minutesShort'
  | 'minutes'
  | 'change'
  | 'selectInterchangePrompt'
  | 'allStations'
  | 'interchangeStations'
  | 'changeMetroLineHere'
  | 'noInterchangeNeeded'
  | 'journeyTimelinePrompt'
  | 'journeyTimeline'
  | 'stations'
  | 'downloadJourneyTimeline'
  | 'downloadTimeline'
  | 'toward'
  | 'selectDestination'
  | 'creatorLinks'
  | 'createdBy'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'copySupportEmail'
  | 'supportEmailCopied'
  | 'shareRoute'
  | 'copyRouteLink'
  | 'routeLinkCopied'
  | 'shareVia'
  | 'shareOnTwitter'
  | 'shareOnReddit'
  | 'shareOnInstagram'
  | 'instagramLinkCopied'
  | 'downloadRoutePng'
  | 'routePngDownloading'
  | 'routePng'
  | 'shareRouteText';

type TranslationValues = Record<string, string | number>;

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
    marathi: 'Marathi',
    bengali: 'Bengali',
    theme: 'Theme',
    switchToLightTheme: 'Switch to light theme',
    switchToDarkTheme: 'Switch to dark theme',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    fromStation: 'From station',
    toStation: 'To station',
    planJourney: 'Plan journey',
    useSmoothRouteAnimation: 'Use smooth route animation',
    smoothRouteAnimation: 'Smooth route animation',
    stepRouteAnimation: 'Step route animation',
    smooth: 'Smooth',
    step: 'Step',
    cinematicExportZoom: 'Cinematic export zoom',
    swapFromAndToStations: 'Swap from and to stations',
    swapStations: 'Swap stations',
    chooseRoute: 'Choose a route',
    routeTitle: '{{from}} to {{to}}',
    routeOptions: 'Route options',
    routeOption: 'Route {{count}}',
    recommended: 'Recommended',
    directRoute: 'Direct',
    viaStation: 'Via {{station}}',
    moreInterchanges: '+{{count}} more',
    sortRoutes: 'Sort routes',
    sortByInterchanges: 'Fewest changes',
    sortByStops: 'Fewest stops',
    playRoute: 'Play route',
    routePlanner: 'Route planner',
    delhiMetro: 'Delhi Metro',
    fare: 'Fare',
    stops: 'Stops',
    time: 'Time',
    minutesShort: '{{count}}m',
    minutes: '{{count}} mins',
    change: 'Change',
    selectInterchangePrompt: 'Select source and destination to see interchange stations.',
    allStations: 'All stations',
    interchangeStations: 'Interchange stations',
    changeMetroLineHere: 'Change metro line here',
    noInterchangeNeeded: 'No interchange needed for this route.',
    journeyTimelinePrompt: 'Plan a journey to see the station timeline.',
    journeyTimeline: 'Journey timeline',
    stations: '{{count}} stations',
    downloadJourneyTimeline: 'Download journey timeline as PNG',
    downloadTimeline: 'Download timeline',
    toward: 'Toward',
    selectDestination: 'Select destination',
    creatorLinks: 'Creator links',
    createdBy: 'Created by',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    youtube: 'YouTube',
    copySupportEmail: 'Copy support email',
    supportEmailCopied: 'Email copied',
    shareRoute: 'Share route',
    copyRouteLink: 'Copy route link',
    routeLinkCopied: 'Route link copied',
    shareVia: 'Share via',
    shareOnTwitter: 'Twitter/X',
    shareOnReddit: 'Reddit',
    shareOnInstagram: 'Instagram',
    instagramLinkCopied: 'Link copied for Instagram',
    downloadRoutePng: 'Download route PNG',
    routePngDownloading: 'Preparing PNG',
    routePng: 'Route PNG',
    shareRouteText: 'Delhi Metro route from {{from}} to {{to}} with {{stops}} stops, {{time}} travel time, and ₹{{fare}} fare.',
  },
  hi: {
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    marathi: 'मराठी',
    bengali: 'बंगाली',
    theme: 'थीम',
    switchToLightTheme: 'लाइट थीम पर जाएं',
    switchToDarkTheme: 'डार्क थीम पर जाएं',
    lightTheme: 'लाइट थीम',
    darkTheme: 'डार्क थीम',
    fromStation: 'प्रस्थान स्टेशन',
    toStation: 'गंतव्य स्टेशन',
    planJourney: 'यात्रा योजना',
    useSmoothRouteAnimation: 'स्मूथ रूट एनीमेशन इस्तेमाल करें',
    smoothRouteAnimation: 'स्मूथ रूट एनीमेशन',
    stepRouteAnimation: 'स्टेप रूट एनीमेशन',
    smooth: 'स्मूथ',
    step: 'स्टेप',
    cinematicExportZoom: 'सिनेमैटिक एक्सपोर्ट ज़ूम',
    swapFromAndToStations: 'प्रस्थान और गंतव्य स्टेशन बदलें',
    swapStations: 'स्टेशन बदलें',
    chooseRoute: 'रूट चुनें',
    routeTitle: '{{from}} से {{to}}',
    routeOptions: 'रूट विकल्प',
    routeOption: 'रूट {{count}}',
    recommended: 'सुझाया गया',
    directRoute: 'सीधा',
    viaStation: '{{station}} के जरिए',
    moreInterchanges: '+{{count}} और',
    sortRoutes: 'रूट क्रमबद्ध करें',
    sortByInterchanges: 'सबसे कम बदलाव',
    sortByStops: 'सबसे कम स्टॉप',
    playRoute: 'रूट चलाएं',
    routePlanner: 'रूट प्लानर',
    delhiMetro: 'दिल्ली मेट्रो',
    fare: 'किराया',
    stops: 'स्टॉप',
    time: 'समय',
    minutesShort: '{{count}}मि',
    minutes: '{{count}} मिनट',
    change: 'बदलें',
    selectInterchangePrompt: 'इंटरचेंज स्टेशन देखने के लिए प्रस्थान और गंतव्य चुनें।',
    allStations: 'सभी स्टेशन',
    interchangeStations: 'इंटरचेंज स्टेशन',
    changeMetroLineHere: 'यहां मेट्रो लाइन बदलें',
    noInterchangeNeeded: 'इस रूट पर इंटरचेंज की जरूरत नहीं है।',
    journeyTimelinePrompt: 'स्टेशन टाइमलाइन देखने के लिए यात्रा योजना बनाएं।',
    journeyTimeline: 'यात्रा टाइमलाइन',
    stations: '{{count}} स्टेशन',
    downloadJourneyTimeline: 'यात्रा टाइमलाइन PNG के रूप में डाउनलोड करें',
    downloadTimeline: 'टाइमलाइन डाउनलोड करें',
    toward: 'की ओर',
    selectDestination: 'गंतव्य चुनें',
    creatorLinks: 'क्रिएटर लिंक',
    createdBy: 'बनाया गया',
    linkedin: 'लिंक्डइन',
    github: 'गिटहब',
    youtube: 'यूट्यूब',
    copySupportEmail: 'सपोर्ट ईमेल कॉपी करें',
    supportEmailCopied: 'ईमेल कॉपी हो गया',
    shareRoute: 'रूट शेयर करें',
    copyRouteLink: 'रूट लिंक कॉपी करें',
    routeLinkCopied: 'रूट लिंक कॉपी हो गया',
    shareVia: 'शेयर करें',
    shareOnTwitter: 'ट्विटर/X',
    shareOnReddit: 'रेडिट',
    shareOnInstagram: 'इंस्टाग्राम',
    instagramLinkCopied: 'इंस्टाग्राम के लिए लिंक कॉपी हो गया',
    downloadRoutePng: 'रूट PNG डाउनलोड करें',
    routePngDownloading: 'PNG तैयार हो रहा है',
    routePng: 'रूट PNG',
    shareRouteText: '{{from}} से {{to}} तक दिल्ली मेट्रो रूट: {{stops}} स्टॉप, {{time}} यात्रा समय, और ₹{{fare}} किराया।',
  },
  mr: {
    language: 'भाषा',
    english: 'इंग्रजी',
    hindi: 'हिंदी',
    marathi: 'मराठी',
    bengali: 'बंगाली',
    theme: 'थीम',
    switchToLightTheme: 'लाइट थीमवर जा',
    switchToDarkTheme: 'डार्क थीमवर जा',
    lightTheme: 'लाइट थीम',
    darkTheme: 'डार्क थीम',
    fromStation: 'प्रस्थान स्थानक',
    toStation: 'गंतव्य स्थानक',
    planJourney: 'प्रवास नियोजित करा',
    useSmoothRouteAnimation: 'स्मूथ मार्ग अॅनिमेशन वापरा',
    smoothRouteAnimation: 'स्मूथ मार्ग अॅनिमेशन',
    stepRouteAnimation: 'स्टेप मार्ग अॅनिमेशन',
    smooth: 'स्मूथ',
    step: 'स्टेप',
    cinematicExportZoom: 'सिनेमॅटिक एक्सपोर्ट झूम',
    swapFromAndToStations: 'प्रस्थान आणि गंतव्य स्थानके बदला',
    swapStations: 'स्थानके बदला',
    chooseRoute: 'मार्ग निवडा',
    routeTitle: '{{from}} ते {{to}}',
    routeOptions: 'मार्ग पर्याय',
    routeOption: 'मार्ग {{count}}',
    recommended: 'शिफारस केलेला',
    directRoute: 'थेट',
    viaStation: '{{station}} मार्गे',
    moreInterchanges: '+{{count}} अधिक',
    sortRoutes: 'मार्ग क्रमवारी',
    sortByInterchanges: 'कमी बदल',
    sortByStops: 'कमी थांबे',
    playRoute: 'मार्ग प्ले करा',
    routePlanner: 'मार्ग नियोजक',
    delhiMetro: 'दिल्ली मेट्रो',
    fare: 'भाडे',
    stops: 'थांबे',
    time: 'वेळ',
    minutesShort: '{{count}}मि',
    minutes: '{{count}} मिनिटे',
    change: 'बदला',
    selectInterchangePrompt: 'इंटरचेंज स्थानके पाहण्यासाठी प्रस्थान आणि गंतव्य निवडा.',
    allStations: 'सर्व स्थानके',
    interchangeStations: 'इंटरचेंज स्थानके',
    changeMetroLineHere: 'इथे मेट्रो लाईन बदला',
    noInterchangeNeeded: 'या मार्गावर इंटरचेंजची गरज नाही.',
    journeyTimelinePrompt: 'स्थानक टाइमलाइन पाहण्यासाठी प्रवास नियोजित करा.',
    journeyTimeline: 'प्रवास टाइमलाइन',
    stations: '{{count}} स्थानके',
    downloadJourneyTimeline: 'प्रवास टाइमलाइन PNG म्हणून डाउनलोड करा',
    downloadTimeline: 'टाइमलाइन डाउनलोड करा',
    toward: 'च्या दिशेने',
    selectDestination: 'गंतव्य निवडा',
    creatorLinks: 'निर्मात्याचे दुवे',
    createdBy: 'निर्मिती',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    youtube: 'YouTube',
    copySupportEmail: 'सपोर्ट ईमेल कॉपी करा',
    supportEmailCopied: 'ईमेल कॉपी झाला',
    shareRoute: 'मार्ग शेअर करा',
    copyRouteLink: 'मार्ग लिंक कॉपी करा',
    routeLinkCopied: 'मार्ग लिंक कॉपी झाली',
    shareVia: 'शेअर करा',
    shareOnTwitter: 'Twitter/X',
    shareOnReddit: 'Reddit',
    shareOnInstagram: 'Instagram',
    instagramLinkCopied: 'Instagram साठी लिंक कॉपी झाली',
    downloadRoutePng: 'मार्ग PNG डाउनलोड करा',
    routePngDownloading: 'PNG तयार होत आहे',
    routePng: 'मार्ग PNG',
    shareRouteText: '{{from}} ते {{to}} दिल्ली मेट्रो मार्ग: {{stops}} थांबे, {{time}} प्रवास वेळ, आणि ₹{{fare}} भाडे.',
  },
  bn: {
    language: 'ভাষা',
    english: 'ইংরেজি',
    hindi: 'হিন্দি',
    marathi: 'মারাঠি',
    bengali: 'বাংলা',
    theme: 'থিম',
    switchToLightTheme: 'লাইট থিমে যান',
    switchToDarkTheme: 'ডার্ক থিমে যান',
    lightTheme: 'লাইট থিম',
    darkTheme: 'ডার্ক থিম',
    fromStation: 'যাত্রার স্টেশন',
    toStation: 'গন্তব্য স্টেশন',
    planJourney: 'যাত্রা পরিকল্পনা করুন',
    useSmoothRouteAnimation: 'স্মুথ রুট অ্যানিমেশন ব্যবহার করুন',
    smoothRouteAnimation: 'স্মুথ রুট অ্যানিমেশন',
    stepRouteAnimation: 'ধাপে ধাপে রুট অ্যানিমেশন',
    smooth: 'স্মুথ',
    step: 'ধাপে ধাপে',
    cinematicExportZoom: 'সিনেম্যাটিক এক্সপোর্ট জুম',
    swapFromAndToStations: 'যাত্রার এবং গন্তব্য স্টেশন বদলান',
    swapStations: 'স্টেশন বদলান',
    chooseRoute: 'রুট বেছে নিন',
    routeTitle: '{{from}} থেকে {{to}}',
    routeOptions: 'রুট বিকল্প',
    routeOption: 'রুট {{count}}',
    recommended: 'প্রস্তাবিত',
    directRoute: 'সরাসরি',
    viaStation: '{{station}} হয়ে',
    moreInterchanges: '+{{count}} আরও',
    sortRoutes: 'রুট সাজান',
    sortByInterchanges: 'সবচেয়ে কম পরিবর্তন',
    sortByStops: 'সবচেয়ে কম স্টপ',
    playRoute: 'রুট চালান',
    routePlanner: 'রুট প্ল্যানার',
    delhiMetro: 'দিল্লি মেট্রো',
    fare: 'ভাড়া',
    stops: 'স্টপ',
    time: 'সময়',
    minutesShort: '{{count}}মি',
    minutes: '{{count}} মিনিট',
    change: 'পরিবর্তন',
    selectInterchangePrompt: 'ইন্টারচেঞ্জ স্টেশন দেখতে যাত্রার এবং গন্তব্য স্টেশন নির্বাচন করুন।',
    allStations: 'সব স্টেশন',
    interchangeStations: 'ইন্টারচেঞ্জ স্টেশন',
    changeMetroLineHere: 'এখানে মেট্রো লাইন বদলান',
    noInterchangeNeeded: 'এই রুটে ইন্টারচেঞ্জের প্রয়োজন নেই।',
    journeyTimelinePrompt: 'স্টেশন টাইমলাইন দেখতে একটি যাত্রা পরিকল্পনা করুন।',
    journeyTimeline: 'যাত্রার টাইমলাইন',
    stations: '{{count}} স্টেশন',
    downloadJourneyTimeline: 'যাত্রার টাইমলাইন PNG হিসেবে ডাউনলোড করুন',
    downloadTimeline: 'টাইমলাইন ডাউনলোড করুন',
    toward: 'দিকে',
    selectDestination: 'গন্তব্য নির্বাচন করুন',
    creatorLinks: 'ক্রিয়েটর লিংক',
    createdBy: 'তৈরি করেছেন',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    youtube: 'YouTube',
    copySupportEmail: 'সাপোর্ট ইমেল কপি করুন',
    supportEmailCopied: 'ইমেল কপি হয়েছে',
    shareRoute: 'রুট শেয়ার করুন',
    copyRouteLink: 'রুট লিংক কপি করুন',
    routeLinkCopied: 'রুট লিংক কপি হয়েছে',
    shareVia: 'শেয়ার করুন',
    shareOnTwitter: 'Twitter/X',
    shareOnReddit: 'Reddit',
    shareOnInstagram: 'Instagram',
    instagramLinkCopied: 'Instagram-এর জন্য লিংক কপি হয়েছে',
    downloadRoutePng: 'রুট PNG ডাউনলোড করুন',
    routePngDownloading: 'PNG প্রস্তুত হচ্ছে',
    routePng: 'রুট PNG',
    shareRouteText: '{{from}} থেকে {{to}} দিল্লি মেট্রো রুট: {{stops}} স্টপ, {{time}} যাত্রার সময়, এবং ₹{{fare}} ভাড়া।',
  },
};

const stationNamesHi: Record<string, string> = {
  RI: 'रिठाला',
  RHW: 'रोहिणी वेस्ट',
  RHE: 'रोहिणी ईस्ट',
  PTP: 'पीतमपुरा',
  KE: 'कोहाट एन्क्लेव',
  NSHP: 'नेताजी सुभाष प्लेस',
  KP: 'केशव पुरम',
  KN: 'कन्हैया नगर',
  ILOK: 'इंद्रलोक',
  SHT: 'शास्त्री नगर',
  PRA: 'प्रताप नगर',
  PBGH: 'पुलबंगश',
  TZI: 'तीस हजारी',
  KG: 'कश्मीरी गेट',
  SHPK: 'शास्त्री पार्क',
  SLAP: 'सीलमपुर',
  WC: 'वेलकम',
  SHD: 'शाहदरा',
  MPK: 'मानसरोवर पार्क',
  JLML: 'झिलमिल',
  DSG: 'दिलशाद गार्डन',
  SHDN: 'शहीद नगर',
  RJBH: 'राज बाग',
  RJNM: 'मेजर मोहित शर्मा राजेंद्र नगर',
  SMPK: 'श्याम पार्क',
  MNGM: 'मोहन नगर',
  ATHA: 'अर्थला',
  HDNR: 'हिंडन रिवर',
  NBAA: 'शहीद स्थल (न्यू बस अड्डा)',
  SPBI: 'समयपुर बादली',
  RISE: 'रोहिणी सेक्टर - 18,19',
  BIMR: 'हैदरपुर बादली मोड़',
  JGPI: 'जहांगीरपुरी',
  AHNR: 'आदर्श नगर',
  AZU: 'आजादपुर',
  MDTW: 'मॉडल टाउन',
  GTBR: 'गुरु तेग बहादुर नगर',
  VW: 'विश्वविद्यालय',
  VS: 'विधान सभा',
  CL: 'सिविल लाइंस',
  CHK: 'चांदनी चौक',
  CWBR: 'चावड़ी बाजार',
  NDI: 'नई दिल्ली',
  RCK: 'राजीव चौक',
  PTCK: 'पटेल चौक',
  CTST: 'सेंट्रल सेक्रेटेरिएट',
  UDB: 'उद्योग भवन',
  LKM: 'लोक कल्याण मार्ग',
  JB: 'जोर बाग',
  INA: 'दिल्ली हाट-आईएनए',
  AIIMS: 'एम्स',
  GNPK: 'ग्रीन पार्क',
  HKS: 'हौज खास',
  MVNR: 'मालवीय नगर',
  SAKT: 'साकेत',
  QM: 'कुतुब मीनार',
  CHTP: 'छतरपुर',
  SLTP: 'सुल्तानपुर',
  GTNI: 'घिटोरनी',
  AJG: 'अर्जन गढ़',
  GE: 'गुरु द्रोणाचार्य',
  SKRP: 'सिकंदरपुर',
  MGRO: 'एम.जी. रोड',
  IFOC: 'इफ्को चौक',
  HCC: 'मिलेनियम सिटी सेंटर गुरुग्राम',
  DSTO: 'द्वारका सेक्टर - 21',
  DSET: 'द्वारका सेक्टर - 8',
  DSN: 'द्वारका सेक्टर - 9',
  DST: 'द्वारका सेक्टर - 10',
  DSE: 'द्वारका सेक्टर - 11',
  DSW: 'द्वारका सेक्टर - 12',
  DSTN: 'द्वारका सेक्टर - 13',
  DSFN: 'द्वारका सेक्टर - 14',
  DW: 'द्वारका',
  DM: 'द्वारका मोड़',
  NWD: 'नवादा',
  UNW: 'उत्तम नगर वेस्ट',
  UNE: 'उत्तम नगर ईस्ट',
  JPW: 'जनकपुरी वेस्ट',
  JPE: 'जनकपुरी ईस्ट',
  TN: 'तिलक नगर',
  SN: 'सुभाष नगर',
  TG: 'टैगोर गार्डन',
  RG: 'राजौरी गार्डन',
  RN: 'रमेश नगर',
  MN: 'मोती नगर',
  KNR: 'कीर्ति नगर',
  SP: 'शादीपुर',
  PN: 'पटेल नगर',
  RP: 'राजेंद्र प्लेस',
  KB: 'करोल बाग',
  JW: 'झंडेवालान',
  RKAM: 'रामकृष्ण आश्रम मार्ग',
  BRKR: 'बाराखंबा रोड',
  MDHS: 'मंडी हाउस',
  PTMD: 'सुप्रीम कोर्ट',
  IDPT: 'इंद्रप्रस्थ',
  YB: 'यमुना बैंक',
  ASDM: 'अक्षरधाम',
  MVP1: 'मयूर विहार-1',
  MVE: 'मयूर विहार एक्सटेंशन',
  NAGR: 'न्यू अशोक नगर',
  NSFT: 'नोएडा सेक्टर-15',
  NSST: 'नोएडा सेक्टर-16',
  NSET: 'नोएडा सेक्टर-18',
  BCGN: 'बॉटनिकल गार्डन',
  GEC: 'गोल्फ कोर्स',
  NCC: 'नोएडा सिटी सेंटर',
  STFN: 'सेक्टर-34 नोएडा',
  SFTN: 'सेक्टर-52 नोएडा',
  SSON: 'सेक्टर-61 नोएडा',
  SFNN: 'सेक्टर-59 नोएडा',
  SSTN: 'सेक्टर-62 नोएडा',
  NECC: 'नोएडा इलेक्ट्रॉनिक सिटी',
  LN: 'लक्ष्मी नगर',
  NV: 'निर्माण विहार',
  PTVR: 'प्रीत विहार',
  KKDA: 'कड़कड़डूमा',
  AVIT: 'आनंद विहार आई.एस.बी.टी',
  KSHI: 'कौशांबी',
  VASI: 'वैशाली',
  CIPK: 'ब्रिगेडियर होशियार सिंह',
  BUSS: 'बहादुरगढ़ सिटी',
  MIEE: 'पंडित श्री राम शर्मा',
  TKBR: 'टिकरी बॉर्डर',
  TKLM: 'टिकरी कलां',
  GHEM: 'घेवरा मेट्रो स्टेशन',
  MIAA: 'मुंडका इंडस्ट्रियल एरिया (एमआईए)',
  MUDK: 'मुंडका',
  RDPK: 'राजधानी पार्क',
  NRSN: 'नांगलोई रेलवे स्टेशन',
  NNOI: 'नांगलोई',
  SMSM: 'महाराजा सूरजमल स्टेडियम',
  UNRG: 'उद्योग नगर',
  PAGI: 'पीरागढ़ी',
  PVW: 'पश्चिम विहार वेस्ट',
  PVE: 'पश्चिम विहार ईस्ट',
  MAPR: 'मादीपुर',
  SHVP: 'शिवाजी पार्क',
  PBGW: 'पंजाबी बाग वेस्ट',
  PBGA: 'पंजाबी बाग',
  APMN: 'अशोक पार्क मेन',
  SRSM: 'सतगुरु राम सिंह मार्ग',
  LLQA: 'लाल किला',
  JAMD: 'जामा मस्जिद',
  DLIG: 'दिल्ली गेट',
  ITO: 'आईटीओ',
  JNPH: 'जनपथ',
  KM: 'खान मार्केट',
  JLNS: 'जेएलएन स्टेडियम',
  JGPA: 'जंगपुरा',
  LJPN: 'लाजपत नगर',
  MLCD: 'मूलचंद',
  KHCY: 'कैलाश कॉलोनी',
  NP: 'नेहरू प्लेस',
  KJMD: 'कालकाजी मंदिर',
  GDPI: 'गोविंद पुरी',
  HNOK: 'हरकेश नगर ओखला',
  JLA: 'जसोला अपोलो',
  STVR: 'सरिता विहार',
  METE: 'मोहन एस्टेट',
  TKDS: 'तुगलकाबाद स्टेशन',
  BAPB: 'बदरपुर बॉर्डर',
  SRAI: 'सराय',
  NHPC: 'एनएचपीसी चौक',
  MMJR: 'मेवला महाराजपुर',
  STTA: 'सेक्टर-28',
  BKMR: 'बड़कल मोड़',
  OFDB: 'ओल्ड फरीदाबाद',
  NCAJ: 'नीलम चौक अजरोंदा',
  BACH: 'बाटा चौक',
  ECMJ: 'एस्कॉर्ट्स मुजेसर',
  NCBC: 'संत सूरदास (सिही)',
  BVHM: 'राजा नाहर सिंह (बल्लभगढ़)',
  MKPR: 'मजलिस पार्क',
  SMBG: 'शालीमार बाग',
  SAKP: 'शकूरपुर',
  ESIH: 'ईएसआई-बसीदारापुर',
  MYPI: 'मायापुरी',
  NAVR: 'नारायणा विहार',
  DLIC: 'दिल्ली कैंट',
  DDSC: 'दुर्गाबाई देशमुख साउथ कैंपस',
  SVMB: 'सर एम. विश्वेश्वरैया मोती बाग',
  BKCP: 'भीकाजी कामा प्लेस',
  SOJI: 'सरोजिनी नगर',
  SOEN: 'साउथ एक्सटेंशन',
  VNPR: 'विनोबापुरी',
  AHRM: 'आश्रम',
  NIZM: 'सराय काले खां निजामुद्दीन',
  MVPO: 'मयूर विहार पॉकेट-1',
  TKPR: 'त्रिलोकपुरी-संजय लेक',
  VENT: 'ईस्ट विनोद नगर-मयूर विहार -II',
  VNNR: 'मंडावली वेस्ट विनोद नगर',
  IPE: 'आईपी एक्सटेंशन',
  KKDC: 'कड़कड़डूमा कोर्ट',
  KHNA: 'कृष्णा नगर',
  EANR: 'ईस्ट आजाद नगर',
  JFRB: 'जाफराबाद',
  MUPR: 'मौजपुर-बाबरपुर',
  GKPR: 'गोकुलपुरी',
  JIEE: 'जौहरी एन्क्लेव',
  SVVR: 'शिव विहार',
  DBMR: 'डाबड़ी मोड़- जनकपुरी साउथ',
  DSHP: 'दशरथपुरी',
  PALM: 'पालम',
  SABR: 'सदर बाजार कैंटोनमेंट',
  IGDA: 'टर्मिनल-1 आईजीआई एयरपोर्ट',
  SKVR: 'शंकर विहार',
  VTVR: 'वसंत विहार',
  MIRK: 'मुनिरका',
  RKPM: 'आर के पुरम',
  IIT: 'आईआईटी',
  PSPK: 'पंचशील पार्क',
  CDLI: 'चिराग दिल्ली',
  GKEI: 'ग्रेटर कैलाश',
  NUEE: 'नेहरू एन्क्लेव',
  OKNS: 'ओखला एनएसआईसी',
  IWNR: 'सुखदेव विहार',
  JANR: 'जामिया मिल्लिया इस्लामिया',
  OVA: 'ओखला विहार',
  JLA8: 'जसोला विहार शाहीन बाग',
  KIKJ: 'कालिंदी कुंज',
  OKBS: 'ओखला बर्ड सैंक्चुअरी',
  NNGI: 'नांगली',
  NFGH: 'नजफगढ़',
  DNBT: 'ढांसा बस स्टैंड',
  DKV: 'धौला कुआं',
  SJSU: 'शिवाजी स्टेडियम',
  DACY: 'दिल्ली एरोसिटी',
  APOT: 'एयरपोर्ट (टी-3)',
  IICC: 'यशोभूमि द्वारका सेक्टर - 25',
  DL2: 'फेज-2',
  BEL: 'बेल्वेडियर टावर्स',
  GAT: 'साइबर सिटी',
  MAL: 'मौलसरी एवेन्यू',
  DL3: 'फेज-3',
  PH1: 'फेज-1',
  SUL: 'सेक्टर 42-43',
  S53: 'सेक्टर 53-54',
  AIT: 'सेक्टर 54 चौक',
  S55: 'सेक्टर 55-56',
};

const languageOptions: Language[] = ['en', 'hi', 'mr', 'bn'];

type TransliterationScript = 'devanagari' | 'bengali';

const transliterationMaps = {
  devanagari: {
    virama: '्',
    vowels: {
      a: ['अ', ''],
      aa: ['आ', 'ा'],
      i: ['इ', 'ि'],
      ee: ['ई', 'ी'],
      u: ['उ', 'ु'],
      oo: ['ऊ', 'ू'],
      e: ['ए', 'े'],
      ai: ['ऐ', 'ै'],
      o: ['ओ', 'ो'],
      au: ['औ', 'ौ'],
    },
    consonants: {
      kh: 'ख',
      gh: 'घ',
      chh: 'छ',
      ch: 'च',
      jh: 'झ',
      th: 'थ',
      dh: 'ध',
      ph: 'फ',
      bh: 'भ',
      sh: 'श',
      k: 'क',
      g: 'ग',
      j: 'ज',
      t: 'ट',
      d: 'ड',
      n: 'न',
      p: 'प',
      b: 'ब',
      m: 'म',
      y: 'य',
      r: 'र',
      l: 'ल',
      v: 'व',
      w: 'व',
      s: 'स',
      h: 'ह',
      f: 'फ',
      z: 'ज़',
      q: 'क',
      x: 'क्स',
    },
    letters: {
      a: 'ए',
      b: 'बी',
      c: 'सी',
      d: 'डी',
      e: 'ई',
      f: 'एफ',
      g: 'जी',
      h: 'एच',
      i: 'आई',
      j: 'जे',
      k: 'के',
      l: 'एल',
      m: 'एम',
      n: 'एन',
      o: 'ओ',
      p: 'पी',
      q: 'क्यू',
      r: 'आर',
      s: 'एस',
      t: 'टी',
      u: 'यू',
      v: 'वी',
      w: 'डब्ल्यू',
      x: 'एक्स',
      y: 'वाई',
      z: 'ज़ेड',
    },
  },
  bengali: {
    virama: '্',
    vowels: {
      a: ['অ', ''],
      aa: ['আ', 'া'],
      i: ['ই', 'ি'],
      ee: ['ঈ', 'ী'],
      u: ['উ', 'ু'],
      oo: ['ঊ', 'ূ'],
      e: ['এ', 'ে'],
      ai: ['ঐ', 'ৈ'],
      o: ['ও', 'ো'],
      au: ['ঔ', 'ৌ'],
    },
    consonants: {
      kh: 'খ',
      gh: 'ঘ',
      chh: 'ছ',
      ch: 'চ',
      jh: 'ঝ',
      th: 'থ',
      dh: 'ধ',
      ph: 'ফ',
      bh: 'ভ',
      sh: 'শ',
      k: 'ক',
      g: 'গ',
      j: 'জ',
      t: 'ট',
      d: 'ড',
      n: 'ন',
      p: 'প',
      b: 'ব',
      m: 'ম',
      y: 'য',
      r: 'র',
      l: 'ল',
      v: 'ভ',
      w: 'ও',
      s: 'স',
      h: 'হ',
      f: 'ফ',
      z: 'জ',
      q: 'ক',
      x: 'ক্স',
    },
    letters: {
      a: 'এ',
      b: 'বি',
      c: 'সি',
      d: 'ডি',
      e: 'ই',
      f: 'এফ',
      g: 'জি',
      h: 'এইচ',
      i: 'আই',
      j: 'জে',
      k: 'কে',
      l: 'এল',
      m: 'এম',
      n: 'এন',
      o: 'ও',
      p: 'পি',
      q: 'কিউ',
      r: 'আর',
      s: 'এস',
      t: 'টি',
      u: 'ইউ',
      v: 'ভি',
      w: 'ডব্লিউ',
      x: 'এক্স',
      y: 'ওয়াই',
      z: 'জেড',
    },
  },
} as const;

const vowelPatterns = ['ai', 'au', 'aa', 'ee', 'oo', 'ei', 'ou', 'a', 'i', 'u', 'e', 'o'] as const;
const consonantPatterns = ['chh', 'kh', 'gh', 'ch', 'jh', 'th', 'dh', 'ph', 'bh', 'sh', 'k', 'g', 'j', 't', 'd', 'n', 'p', 'b', 'm', 'y', 'r', 'l', 'v', 'w', 's', 'h', 'f', 'z', 'q', 'x'] as const;
const softFinalConsonants = new Set(['r', 'n', 'm', 'l', 's', 'h', 'y']);

const normalizeVowel = (vowel: string) => {
  if (vowel === 'ei') return 'ai';
  if (vowel === 'ou') return 'au';
  return vowel as keyof typeof transliterationMaps.devanagari.vowels;
};

const matchPattern = <T extends readonly string[]>(text: string, index: number, patterns: T) =>
  patterns.find((pattern) => text.startsWith(pattern, index));

const transliterateAcronym = (word: string, script: TransliterationScript) => {
  const { letters } = transliterationMaps[script];
  return word
    .toLowerCase()
    .split('')
    .map((letter) => letters[letter as keyof typeof letters] || letter)
    .join(' ');
};

const transliterateWord = (word: string, script: TransliterationScript) => {
  if (/^[A-Z]{2,}$/.test(word)) return transliterateAcronym(word, script);

  const map = transliterationMaps[script];
  const text = word.toLowerCase();
  let result = '';
  let index = 0;

  while (index < text.length) {
    const current = text[index];

    if (!/[a-z]/.test(current)) {
      result += current;
      index += 1;
      continue;
    }

    const vowel = matchPattern(text, index, vowelPatterns);
    if (vowel) {
      result += map.vowels[normalizeVowel(vowel)][0];
      index += vowel.length;
      continue;
    }

    const consonant = matchPattern(text, index, consonantPatterns);
    if (!consonant) {
      result += current;
      index += 1;
      continue;
    }

    const nextIndex = index + consonant.length;
    const nextVowel = matchPattern(text, nextIndex, vowelPatterns);

    if (nextVowel) {
      result += map.consonants[consonant as keyof typeof map.consonants] + map.vowels[normalizeVowel(nextVowel)][1];
      index = nextIndex + nextVowel.length;
      continue;
    }

    const isSoftFinal = nextIndex >= text.length && softFinalConsonants.has(consonant);
    result += map.consonants[consonant as keyof typeof map.consonants] + (isSoftFinal ? '' : map.virama);
    index = nextIndex;
  }

  return result;
};

const transliterateStationName = (name: string, script: TransliterationScript) =>
  name.replace(/[A-Za-z]+/g, (word) => transliterateWord(word, script));

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';

  const urlLanguage = new URLSearchParams(window.location.search).get('lang');
  if (languageOptions.includes(urlLanguage as Language)) return urlLanguage as Language;

  const storedLanguage = window.localStorage.getItem('language');
  return languageOptions.includes(storedLanguage as Language) ? storedLanguage as Language : 'en';
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('language', language);

    const url = new URL(window.location.href);
    if (language !== 'en') {
      url.searchParams.set('lang', language);
    } else {
      url.searchParams.delete('lang');
    }
    const queryString = url.searchParams.toString();
    window.history.replaceState(window.history.state, '', `${url.pathname}${queryString ? `?${queryString}` : ''}${url.hash}`);
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key, values = {}) =>
      Object.entries(values).reduce(
        (message, [name, replacement]) => message.replaceAll(`{{${name}}}`, String(replacement)),
        translations[language][key] || translations.en[key]
      ),
  }), [language]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
};

export const availableLanguages = languageOptions;

export const getLocalizedStationName = (id: string, fallbackName: string, language: Language) => {
  if (language === 'hi') return stationNamesHi[id] || transliterateStationName(fallbackName, 'devanagari');
  if (language === 'mr') return transliterateStationName(fallbackName, 'devanagari');
  if (language === 'bn') return transliterateStationName(fallbackName, 'bengali');

  return fallbackName;
};
