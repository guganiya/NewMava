import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ==========================================

interface Vehicle {
    id: string;
    name: string;
    dim: [number, number, number];
    maxW: number;
    type: 'sea' | 'road' | 'air' | 'rail';
    baseRate: number;
    currency: string;
}

interface CargoItem {
    id: number;
    name: string;
    qty: number;
    l: number;
    w: number;
    h: number;
    wt: number;
    unit: 'm' | 'cm';
    stackable: boolean;
    fragile: boolean;
    hazard: boolean;
    hazardClass?: string;
    value: number;
    color: string;
}

interface Route {
    id: string;
    from: string;
    to: string;
    distance: number;
    transitDays: number;
    baseRate: number;
}

interface Calculation {
    id: number;
    date: string;
    vehicle: string;
    route: string;
    totalWeight: number;
    totalVolume: number;
    totalCost: number;
    cargoCount: number;
}

// ==========================================
// КОНСТАНТЫ И ДАННЫЕ
// ==========================================

const VEHICLES: Record<string, Vehicle[]> = {
    sea: [
        { id: '20st', name: "20' Standard", dim: [5.9, 2.35, 2.39], maxW: 28.2, type: 'sea', baseRate: 1500, currency: 'USD' },
        { id: '40st', name: "40' Standard", dim: [12.03, 2.35, 2.39], maxW: 26.7, type: 'sea', baseRate: 2200, currency: 'USD' },
        { id: '40hc', name: "40' High Cube", dim: [12.03, 2.35, 2.69], maxW: 28.5, type: 'sea', baseRate: 2400, currency: 'USD' },
        { id: '45hc', name: "45' High Cube", dim: [13.56, 2.35, 2.69], maxW: 27.6, type: 'sea', baseRate: 2800, currency: 'USD' },
        { id: '20rf', name: "20' Reefer", dim: [5.44, 2.29, 2.27], maxW: 27.4, type: 'sea', baseRate: 3500, currency: 'USD' },
        { id: '40rf', name: "40' Reefer", dim: [11.56, 2.29, 2.55], maxW: 29.3, type: 'sea', baseRate: 5000, currency: 'USD' },
    ],
    road: [
        { id: 'euro', name: "Euro-truck", dim: [13.6, 2.45, 2.7], maxW: 22.0, type: 'road', baseRate: 1.2, currency: 'EUR/km' },
        { id: 'mega', name: "Mega Trailer", dim: [13.6, 2.48, 3.0], maxW: 20.0, type: 'road', baseRate: 1.4, currency: 'EUR/km' },
        { id: 'lowboy', name: "Lowboy Trawl", dim: [15.0, 3.0, 0.9], maxW: 45.0, type: 'road', baseRate: 3.5, currency: 'EUR/km' },
        { id: 'jumbo', name: "Jumbo Trailer", dim: [13.6, 2.48, 2.95], maxW: 24.0, type: 'road', baseRate: 1.5, currency: 'EUR/km' },
        { id: 'curtain', name: "Curtainsider", dim: [13.6, 2.45, 2.7], maxW: 24.0, type: 'road', baseRate: 1.1, currency: 'EUR/km' },
    ],
    air: [
        { id: 'pallet', name: "Air Pallet (PMC)", dim: [3.18, 2.44, 1.63], maxW: 4.5, type: 'air', baseRate: 4.5, currency: 'USD/kg' },
        { id: 'container', name: "Air Container (LD3)", dim: [1.53, 1.56, 1.63], maxW: 1.6, type: 'air', baseRate: 5.2, currency: 'USD/kg' },
        { id: 'bulk', name: "Bulk Cargo", dim: [10.0, 3.0, 3.0], maxW: 100.0, type: 'air', baseRate: 3.8, currency: 'USD/kg' },
    ],
    rail: [
        { id: 'boxcar', name: "Boxcar 60'", dim: [18.29, 2.74, 2.79], maxW: 68.0, type: 'rail', baseRate: 0.03, currency: 'USD/km/ton' },
        { id: 'flatcar', name: "Flatcar 89'", dim: [27.13, 3.05, 0], maxW: 90.0, type: 'rail', baseRate: 0.025, currency: 'USD/km/ton' },
        { id: 'tank', name: "Tank Car", dim: [15.24, 2.74, 2.74], maxW: 100.0, type: 'rail', baseRate: 0.035, currency: 'USD/km/ton' },
    ]
};

const ROUTES: Route[] = [
    { id: 'sha-rtm', from: 'Shanghai', to: 'Rotterdam', distance: 19500, transitDays: 32, baseRate: 1.0 },
    { id: 'sha-la', from: 'Shanghai', to: 'Los Angeles', distance: 10500, transitDays: 14, baseRate: 1.2 },
    { id: 'rtm-mow', from: 'Rotterdam', to: 'Moscow', distance: 2400, transitDays: 5, baseRate: 1.1 },
    { id: 'hkg-dxb', from: 'Hong Kong', to: 'Dubai', distance: 5900, transitDays: 12, baseRate: 0.9 },
    { id: 'sin-syd', from: 'Singapore', to: 'Sydney', distance: 6300, transitDays: 10, baseRate: 1.0 },
    { id: 'ham-ist', from: 'Hamburg', to: 'Istanbul', distance: 2200, transitDays: 4, baseRate: 1.05 },
    { id: 'mum-lond', from: 'Mumbai', to: 'London', distance: 8800, transitDays: 22, baseRate: 1.15 },
    { id: 'bue-bar', from: 'Buenos Aires', to: 'Barcelona', distance: 10200, transitDays: 25, baseRate: 1.1 },
];

const CARGO_TEMPLATES: Partial<CargoItem>[] = [
    { name: 'Euro Pallet', l: 1.2, w: 0.8, h: 1.8, wt: 0.8, stackable: true },
    { name: 'US Pallet', l: 1.016, w: 1.219, h: 1.8, wt: 1.0, stackable: true },
    { name: 'ISO Container Box', l: 1.2, w: 1.0, h: 1.0, wt: 0.5, stackable: true },
    { name: 'Drum 200L', l: 0.6, w: 0.6, h: 0.88, wt: 0.25, stackable: false },
    { name: 'IBC Tank 1000L', l: 1.2, w: 1.0, h: 1.16, wt: 1.2, stackable: false },
    { name: 'Coil (Steel)', l: 1.5, w: 1.5, h: 1.5, wt: 15.0, stackable: false },
    { name: 'Machinery Crate', l: 3.0, w: 2.0, h: 2.5, wt: 8.0, stackable: false },
    { name: 'Carton Box S', l: 0.4, w: 0.3, h: 0.3, wt: 0.02, stackable: true },
    { name: 'Carton Box M', l: 0.6, w: 0.4, h: 0.4, wt: 0.03, stackable: true },
    { name: 'Carton Box L', l: 0.8, w: 0.6, h: 0.5, wt: 0.04, stackable: true },
];

const HAZARD_CLASSES = [
    { id: '1', name: 'Explosives', icon: '💥' },
    { id: '2', name: 'Gases', icon: '🔵' },
    { id: '3', name: 'Flammable Liquids', icon: '🔥' },
    { id: '4', name: 'Flammable Solids', icon: '🟡' },
    { id: '5', name: 'Oxidizers', icon: '⭕' },
    { id: '6', name: 'Toxic/Infectious', icon: '☠️' },
    { id: '7', name: 'Radioactive', icon: '☢️' },
    { id: '8', name: 'Corrosive', icon: '⚗️' },
    { id: '9', name: 'Miscellaneous', icon: '⚠️' },
];

const CURRENCIES: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    CNY: 7.24,
    RUB: 92.5,
    JPY: 149.5,
};

const INSURANCE_RATES = {
    standard: 0.003,
    fragile: 0.008,
    hazard: 0.015,
    highValue: 0.005,
};

// ==========================================
// УТИЛИТЫ
// ==========================================

const generateId = () => Date.now() + Math.random();

const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatNumber = (num: number, decimals: number = 2) => {
    return Number(num.toFixed(decimals));
};

const getRandomColor = () => {
    const colors = [
        '#8B122B', '#1E3A5F', '#2D4A22', '#5D3A1A', '#4A1A5D',
        '#1A4A5D', '#5D4A1A', '#3A1A5D', '#1A5D3A', '#5D1A3A'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const calculateCBM = (l: number, w: number, h: number, qty: number, unit: 'm' | 'cm') => {
    const factor = unit === 'cm' ? 0.000001 : 1;
    return l * w * h * qty * factor;
};

const calculateChargeableWeight = (weight: number, volume: number, mode: string) => {
    const dimFactors: Record<string, number> = {
        sea: 1000,
        road: 333,
        air: 167,
        rail: 500,
    };
    const dimWeight = volume * dimFactors[mode];
    return Math.max(weight, dimWeight);
};

// ==========================================
// КОМПОНЕНТЫ UI
// ==========================================

const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => (
    <div className="relative group inline-block">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-white/10">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
    </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'warning' | 'danger' | 'success' }> = ({ children, variant = 'default' }) => {
    const variants = {
        default: 'bg-white/10 text-white/60',
        warning: 'bg-yellow-500/20 text-yellow-400',
        danger: 'bg-red-500/20 text-red-400',
        success: 'bg-green-500/20 text-green-400',
    };
    return <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${variants[variant]}`}>{children}</span>;
};

const ProgressBar: React.FC<{ value: number; max: number; label?: string; showPercent?: boolean }> = ({ value, max, label, showPercent = true }) => {
    const percent = Math.min((value / max) * 100, 100);
    const isOverflow = value > max;

    return (
        <div className="w-full">
            {label && <p className="text-[8px] text-white/40 uppercase mb-1">{label}</p>}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    className={`h-full rounded-full ${isOverflow ? 'bg-red-500' : percent > 80 ? 'bg-yellow-500' : 'bg-[#8B122B]'}`}
                />
            </div>
            {showPercent && (
                <p className={`text-[10px] mt-1 ${isOverflow ? 'text-red-400' : 'text-white/40'}`}>
                    {formatNumber(value, 1)} / {max} ({formatNumber(percent, 0)}%)
                </p>
            )}
        </div>
    );
};

const StatCard: React.FC<{ icon: string; label: string; value: string | number; unit?: string; warning?: boolean; info?: string }> = ({ icon, label, value, unit, warning, info }) => (
    <Tooltip text={info || label}>
        <div className={`bg-white/5 rounded-xl p-4 border ${warning ? 'border-red-500/50' : 'border-white/5'} hover:border-white/20 transition-all`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{icon}</span>
                <p className="text-[8px] text-white/40 uppercase font-bold tracking-wider">{label}</p>
            </div>
            <p className={`text-xl font-black ${warning ? 'text-red-400' : 'text-white'}`}>
                {value}
                {unit && <span className="text-xs opacity-40 ml-1">{unit}</span>}
            </p>
        </div>
    </Tooltip>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; icon?: string }> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
            active ? 'bg-[#8B122B] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
        }`}
    >
        {icon && <span>{icon}</span>}
        {children}
    </button>
);

// ==========================================
// ОСНОВНОЙ КОМПОНЕНТ
// ==========================================

const MavaLogisticsPro: React.FC = () => {
    // --- Состояние приложения ---
    const [activeTab, setActiveTab] = useState<'cargo' | 'route' | 'costs' | 'settings'>('cargo');
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(VEHICLES.sea[0]);
    const [selectedRoute, setSelectedRoute] = useState<Route>(ROUTES[0]);
    const [cargoList, setCargoList] = useState<CargoItem[]>([
        { id: generateId(), name: 'Основной груз', qty: 1, l: 3.5, w: 2.2, h: 2.0, wt: 8.5, unit: 'm', stackable: true, fragile: false, hazard: false, value: 50000, color: '#8B122B' }
    ]);

    // Визуализация
    const [isXRay, setIsXRay] = useState(false);
    const [showAxes, setShowAxes] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [autoRotate, setAutoRotate] = useState(false);
    const [cameraPreset, setCameraPreset] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');

    // Режимы
    const [oversizeMode, setOversizeMode] = useState(false);
    const [consolidationMode, setConsolidationMode] = useState(false);

    // Параметры Oversize
    const [oversizeParams, setOversizeParams] = useState({
        tractorW: 8.5,
        trailerW: 12.0,
        tractorAxles: 3,
        trailerAxles: 5,
        maxAxleLoad: 9.0,
        escortRequired: false,
        permitRequired: false,
    });

    // Финансы
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [customRate, setCustomRate] = useState<number | null>(null);
    const [includeInsurance, setIncludeInsurance] = useState(true);
    const [includeCustoms, setIncludeCustoms] = useState(true);
    const [customsDutyRate, setCustomsDutyRate] = useState(0.05);
    const [vatRate, setVatRate] = useState(0.20);

    // История и избранное
    const [calculationHistory, setCalculationHistory] = useState<Calculation[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [notifications, setNotifications] = useState<Array<{ id: number; type: 'warning' | 'error' | 'success' | 'info'; message: string }>>([]);

    // Refs
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<any>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    // --- Вычисления ---
    const calculations = useMemo(() => {
        const [L, W, H] = selectedVehicle.dim;
        const containerVolume = L * W * H;

        let totalWeight = 0;
        let totalVolume = 0;
        let totalValue = 0;
        let totalPieces = 0;
        let hazardousCount = 0;
        let fragileCount = 0;

        cargoList.forEach(item => {
            const factor = item.unit === 'cm' ? 0.01 : 1;
            const itemVolume = item.l * factor * item.w * factor * item.h * factor * item.qty;
            const itemWeight = item.wt * item.qty;

            totalVolume += itemVolume;
            totalWeight += itemWeight;
            totalValue += item.value * item.qty;
            totalPieces += item.qty;

            if (item.hazard) hazardousCount += item.qty;
            if (item.fragile) fragileCount += item.qty;
        });

        const fillPercent = (totalVolume / containerVolume) * 100;
        const weightPercent = (totalWeight / selectedVehicle.maxW) * 100;
        const chargeableWeight = calculateChargeableWeight(totalWeight, totalVolume, selectedVehicle.type);

        // Расчет стоимости
        let baseCost = 0;
        const rate = customRate || selectedVehicle.baseRate;

        switch (selectedVehicle.type) {
            case 'sea':
                baseCost = rate * selectedRoute.baseRate;
                break;
            case 'road':
                baseCost = rate * selectedRoute.distance;
                break;
            case 'air':
                baseCost = rate * chargeableWeight * 1000; // per kg
                break;
            case 'rail':
                baseCost = rate * selectedRoute.distance * totalWeight;
                break;
        }

        // Дополнительные расходы
        let insuranceCost = 0;
        if (includeInsurance) {
            let rate = INSURANCE_RATES.standard;
            if (fragileCount > 0) rate = Math.max(rate, INSURANCE_RATES.fragile);
            if (hazardousCount > 0) rate = Math.max(rate, INSURANCE_RATES.hazard);
            if (totalValue > 100000) rate = Math.max(rate, INSURANCE_RATES.highValue);
            insuranceCost = totalValue * rate;
        }

        let customsCost = 0;
        let vatCost = 0;
        if (includeCustoms) {
            customsCost = totalValue * customsDutyRate;
            vatCost = (totalValue + customsCost) * vatRate;
        }

        const hazardSurcharge = hazardousCount > 0 ? baseCost * 0.25 : 0;
        const oversizeSurcharge = oversizeMode ? baseCost * 0.50 : 0;

        const totalCost = baseCost + insuranceCost + customsCost + vatCost + hazardSurcharge + oversizeSurcharge;

        // Осевая нагрузка
        let axleLoad = 0;
        if (oversizeMode) {
            const totalAxles = oversizeParams.tractorAxles + oversizeParams.trailerAxles;
            const fullWeight = totalWeight + oversizeParams.tractorW + oversizeParams.trailerW;
            axleLoad = totalAxles > 0 ? fullWeight / totalAxles : 0;
        }

        // Сроки доставки
        let transitDays = selectedRoute.transitDays;
        if (selectedVehicle.type === 'air') transitDays = Math.ceil(selectedRoute.distance / 10000) + 1;
        if (selectedVehicle.type === 'rail') transitDays = Math.ceil(selectedRoute.distance / 800) + 2;

        // Конвертация валюты
        const currencyRate = CURRENCIES[selectedCurrency] || 1;
        const convertedCost = totalCost * currencyRate;

        return {
            totalWeight,
            totalVolume: formatNumber(totalVolume, 3),
            totalValue,
            totalPieces,
            fillPercent: formatNumber(fillPercent, 1),
            weightPercent: formatNumber(weightPercent, 1),
            chargeableWeight: formatNumber(chargeableWeight, 2),
            containerVolume: formatNumber(containerVolume, 2),
            hazardousCount,
            fragileCount,
            baseCost: formatNumber(baseCost, 2),
            insuranceCost: formatNumber(insuranceCost, 2),
            customsCost: formatNumber(customsCost, 2),
            vatCost: formatNumber(vatCost, 2),
            hazardSurcharge: formatNumber(hazardSurcharge, 2),
            oversizeSurcharge: formatNumber(oversizeSurcharge, 2),
            totalCost: formatNumber(totalCost, 2),
            convertedCost: formatNumber(convertedCost, 2),
            axleLoad: formatNumber(axleLoad, 2),
            transitDays,
            isOverweight: totalWeight > selectedVehicle.maxW,
            isOverfilled: fillPercent > 100,
            axleOverload: axleLoad > oversizeParams.maxAxleLoad,
        };
    }, [cargoList, selectedVehicle, selectedRoute, oversizeMode, oversizeParams, customRate, includeInsurance, includeCustoms, customsDutyRate, vatRate, selectedCurrency]);

    // --- Уведомления ---
    const addNotification = useCallback((type: 'warning' | 'error' | 'success' | 'info', message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
    }, []);

    // Проверка условий для уведомлений
    useEffect(() => {
        if (calculations.isOverweight) {
            addNotification('error', `Превышен лимит веса! ${calculations.totalWeight.toFixed(1)}T > ${selectedVehicle.maxW}T`);
        }
        if (calculations.isOverfilled) {
            addNotification('warning', `Контейнер переполнен! Заполнение ${calculations.fillPercent}%`);
        }
        if (calculations.axleOverload && oversizeMode) {
            addNotification('warning', `Превышена нагрузка на ось! ${calculations.axleLoad}T > ${oversizeParams.maxAxleLoad}T`);
        }
    }, [calculations.isOverweight, calculations.isOverfilled, calculations.axleOverload]);

    // --- 3D Визуализация ---
    useEffect(() => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.Fog(0x0a0a0a, 30, 80);

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(15, 12, 15);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 50;
        controls.minDistance = 3;
        controls.maxPolarAngle = Math.PI / 2;
        controlsRef.current = controls;

        // Groups
        const cargoGroup = new THREE.Group();
        const containerGroup = new THREE.Group();
        const helpersGroup = new THREE.Group();
        scene.add(cargoGroup, containerGroup, helpersGroup);

        // CoG Marker
        const cogMarker = new THREE.Group();
        const cogSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.2),
            new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.9 })
        );
        const cogRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.35, 0.05, 8, 24),
            new THREE.MeshBasicMaterial({ color: 0xffd700 })
        );
        cogRing.rotation.x = Math.PI / 2;
        cogMarker.add(cogSphere, cogRing);
        scene.add(cogMarker);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(10, 20, 15);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 60;
        mainLight.shadow.camera.left = -20;
        mainLight.shadow.camera.right = 20;
        mainLight.shadow.camera.top = 20;
        mainLight.shadow.camera.bottom = -20;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x4477ff, 0.3);
        fillLight.position.set(-10, 10, -10);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xff4444, 0.2);
        rimLight.position.set(10, -5, -10);
        scene.add(rimLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x080808,
            roughness: 1,
            metalness: 0,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        scene.add(ground);

        sceneRef.current = {
            scene,
            camera,
            renderer,
            controls,
            cargoGroup,
            containerGroup,
            helpersGroup,
            cogMarker,
        };

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const newWidth = mountRef.current.clientWidth;
            const newHeight = mountRef.current.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
            sceneRef.current.frameId = requestAnimationFrame(animate);
            controls.update();

            // Rotate CoG marker
            if (cogMarker.visible) {
                cogRing.rotation.z += 0.02;
            }

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(sceneRef.current?.frameId);
            renderer.dispose();
            if (mountRef.current) mountRef.current.innerHTML = '';
        };
    }, []);

    // --- Update 3D Objects ---
    useEffect(() => {
        if (!sceneRef.current) return;

        const { cargoGroup, containerGroup, helpersGroup, cogMarker, controls } = sceneRef.current;

        // Clear previous objects
        [cargoGroup, containerGroup, helpersGroup].forEach(group => {
            group.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            });
            group.clear();
        });

        const [L, W, H] = selectedVehicle.dim;

        // Container
        const containerMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: isXRay ? 0.08 : 0.03,
            side: THREE.BackSide,
            depthWrite: false,
        });
        const containerGeometry = new THREE.BoxGeometry(L, H, W);
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.position.y = H / 2;
        containerGroup.add(container);

        // Container wireframe
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: isXRay ? 0x4488ff : 0x333333,
            transparent: true,
            opacity: isXRay ? 0.8 : 0.5,
        });
        const wireframeGeometry = new THREE.EdgesGeometry(containerGeometry);
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        wireframe.position.copy(container.position);
        containerGroup.add(wireframe);

        // Grid
        if (showGrid) {
            const gridSize = Math.max(L, W) * 1.5;
            const grid = new THREE.GridHelper(gridSize, Math.floor(gridSize), 0x333333, 0x1a1a1a);
            helpersGroup.add(grid);
        }

        // Axes
        if (showAxes) {
            const axesHelper = new THREE.AxesHelper(L / 2 + 2);
            helpersGroup.add(axesHelper);

            // Axis labels (using sprites)
            const createLabel = (text: string, position: THREE.Vector3, color: string) => {
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d')!;
                ctx.fillStyle = color;
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 32, 32);

                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.copy(position);
                sprite.scale.set(0.8, 0.8, 1);
                return sprite;
            };

            helpersGroup.add(createLabel('X', new THREE.Vector3(L / 2 + 2.5, 0, 0), '#ff4444'));
            helpersGroup.add(createLabel('Y', new THREE.Vector3(0, L / 2 + 2.5, 0), '#44ff44'));
            helpersGroup.add(createLabel('Z', new THREE.Vector3(0, 0, L / 2 + 2.5), '#4444ff'));
        }

        // Auto-rotate
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.5;

        // Packing algorithm (3D Bin Packing - First Fit Decreasing Height)
        let curX = -L / 2;
        let curY = 0;
        let curZ = -W / 2;
        let rowMaxL = 0;
        let layerMaxH = 0;
        let weightedPos = { x: 0, y: 0, z: 0 };
        let totalCargoWeight = 0;

        // Sort cargo by volume (largest first) for better packing
        const sortedCargo = [...cargoList].sort((a, b) => {
            const volA = a.l * a.w * a.h * a.qty;
            const volB = b.l * b.w * b.h * b.qty;
            return volB - volA;
        });

        sortedCargo.forEach((item) => {
            const factor = item.unit === 'cm' ? 0.01 : 1;
            const l = item.l * factor;
            const w = item.w * factor;
            const h = item.h * factor;

            for (let i = 0; i < item.qty; i++) {
                // Check if fits in current row
                if (curZ + w > W / 2 + 0.01) {
                    curZ = -W / 2;
                    curX += rowMaxL;
                    rowMaxL = 0;
                }

                // Check if fits in current layer
                if (curX + l > L / 2 + 0.01) {
                    curX = -L / 2;
                    curZ = -W / 2;
                    curY += layerMaxH;
                    rowMaxL = 0;
                    layerMaxH = 0;
                }

                // Check if fits in container height
                if (curY + h > H + 0.01) break;

                // Create cargo box
                const boxGeometry = new THREE.BoxGeometry(l * 0.96, h * 0.96, w * 0.96);

                let boxColor = item.color;
                if (item.hazard) boxColor = '#ff4444';
                else if (item.fragile) boxColor = '#ffaa44';
                else if (item.wt > 5) boxColor = '#8B122B';

                const boxMaterial = new THREE.MeshStandardMaterial({
                    color: boxColor,
                    metalness: 0.1,
                    roughness: 0.8,
                    transparent: isXRay,
                    opacity: isXRay ? 0.6 : 1,
                });

                const box = new THREE.Mesh(boxGeometry, boxMaterial);
                box.position.set(curX + l / 2, curY + h / 2, curZ + w / 2);
                box.castShadow = true;
                box.receiveShadow = true;

                // Store cargo data for raycasting
                box.userData = { cargo: item, index: i };

                cargoGroup.add(box);

                // Edge highlight
                const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
                const edgeMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.2,
                });
                const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
                edges.position.copy(box.position);
                cargoGroup.add(edges);

                // Hazard/Fragile markers
                if (item.hazard || item.fragile) {
                    const markerGeometry = new THREE.PlaneGeometry(l * 0.3, h * 0.3);
                    const markerCanvas = document.createElement('canvas');
                    markerCanvas.width = 64;
                    markerCanvas.height = 64;
                    const ctx = markerCanvas.getContext('2d')!;
                    ctx.fillStyle = item.hazard ? '#ff4444' : '#ffaa44';
                    ctx.font = 'bold 48px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(item.hazard ? '⚠' : '⚡', 32, 32);

                    const markerTexture = new THREE.CanvasTexture(markerCanvas);
                    const markerMaterial = new THREE.MeshBasicMaterial({
                        map: markerTexture,
                        transparent: true,
                        side: THREE.DoubleSide,
                    });
                    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                    marker.position.set(curX + l / 2, curY + h + 0.01, curZ + w / 2);
                    marker.rotation.x = -Math.PI / 2;
                    cargoGroup.add(marker);
                }

                // Update CoG calculation
                weightedPos.x += (curX + l / 2) * item.wt;
                weightedPos.y += (curY + h / 2) * item.wt;
                weightedPos.z += (curZ + w / 2) * item.wt;
                totalCargoWeight += item.wt;

                // Update cursors
                curZ += w;
                rowMaxL = Math.max(rowMaxL, l);
                layerMaxH = Math.max(layerMaxH, h);
            }
        });

        // Update CoG marker
        if (totalCargoWeight > 0) {
            cogMarker.position.set(
                weightedPos.x / totalCargoWeight,
                0.3,
                weightedPos.z / totalCargoWeight
            );
            cogMarker.visible = oversizeMode;
        } else {
            cogMarker.visible = false;
        }

    }, [cargoList, selectedVehicle, isXRay, showAxes, showGrid, autoRotate, oversizeMode]);

    // --- Camera Presets ---
    useEffect(() => {
        if (!sceneRef.current) return;
        const { camera, controls } = sceneRef.current;
        const [L, W, H] = selectedVehicle.dim;
        const maxDim = Math.max(L, W, H);

        switch (cameraPreset) {
            case 'top':
                camera.position.set(0, maxDim * 2, 0.01);
                break;
            case 'front':
                camera.position.set(maxDim * 1.5, H / 2, 0);
                break;
            case 'side':
                camera.position.set(0, H / 2, maxDim * 1.5);
                break;
            default:
                camera.position.set(maxDim, maxDim * 0.8, maxDim);
        }
        controls.update();
    }, [cameraPreset, selectedVehicle]);

    // --- Cargo Management ---
    const updateCargo = useCallback((id: number, field: keyof CargoItem, value: any) => {
        setCargoList(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    }, []);

    const addCargo = useCallback((template?: Partial<CargoItem>) => {
        const newCargo: CargoItem = {
            id: generateId(),
            name: template?.name || 'Новый груз',
            qty: template?.qty || 1,
            l: template?.l || 2.0,
            w: template?.w || 2.0,
            h: template?.h || 2.0,
            wt: template?.wt || 1.0,
            unit: 'm',
            stackable: template?.stackable ?? true,
            fragile: template?.fragile ?? false,
            hazard: template?.hazard ?? false,
            value: 10000,
            color: getRandomColor(),
        };
        setCargoList(prev => [...prev, newCargo]);
        addNotification('success', `Добавлен груз: ${newCargo.name}`);
    }, [addNotification]);

    const removeCargo = useCallback((id: number) => {
        const cargo = cargoList.find(c => c.id === id);
        setCargoList(prev => prev.filter(c => c.id !== id));
        if (cargo) addNotification('info', `Удален груз: ${cargo.name}`);
    }, [cargoList, addNotification]);

    const duplicateCargo = useCallback((id: number) => {
        const cargo = cargoList.find(c => c.id === id);
        if (cargo) {
            const newCargo = { ...cargo, id: generateId(), name: `${cargo.name} (копия)` };
            setCargoList(prev => [...prev, newCargo]);
            addNotification('success', `Груз скопирован: ${newCargo.name}`);
        }
    }, [cargoList, addNotification]);

    const clearAllCargo = useCallback(() => {
        setCargoList([]);
        addNotification('info', 'Все грузы удалены');
    }, [addNotification]);

    // --- Save Calculation ---
    const saveCalculation = useCallback(() => {
        const newCalc: Calculation = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            vehicle: selectedVehicle.name,
            route: `${selectedRoute.from} → ${selectedRoute.to}`,
            totalWeight: calculations.totalWeight,
            totalVolume: parseFloat(calculations.totalVolume),
            totalCost: calculations.totalCost,
            cargoCount: calculations.totalPieces,
        };
        setCalculationHistory(prev => [newCalc, ...prev.slice(0, 49)]);
        addNotification('success', 'Расчет сохранен в историю');
    }, [selectedVehicle, selectedRoute, calculations, addNotification]);

    // --- Export Functions ---
    const exportToJSON = useCallback(() => {
        const data = {
            vehicle: selectedVehicle,
            route: selectedRoute,
            cargo: cargoList,
            calculations,
            oversizeParams: oversizeMode ? oversizeParams : null,
            exportDate: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mava-logistics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addNotification('success', 'Данные экспортированы в JSON');
    }, [selectedVehicle, selectedRoute, cargoList, calculations, oversizeMode, oversizeParams, addNotification]);

    const exportToCSV = useCallback(() => {
        const headers = ['Name', 'Quantity', 'L(m)', 'W(m)', 'H(m)', 'Weight(t)', 'Value', 'Stackable', 'Fragile', 'Hazard'];
        const rows = cargoList.map(c => [
            c.name,
            c.qty,
            c.unit === 'cm' ? c.l / 100 : c.l,
            c.unit === 'cm' ? c.w / 100 : c.w,
            c.unit === 'cm' ? c.h / 100 : c.h,
            c.wt,
            c.value,
            c.stackable ? 'Yes' : 'No',
            c.fragile ? 'Yes' : 'No',
            c.hazard ? 'Yes' : 'No',
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mava-cargo-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        addNotification('success', 'Данные экспортированы в CSV');
    }, [cargoList, addNotification]);

    // --- Render ---
    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 min-w-[280px] ${
                                n.type === 'error' ? 'bg-red-900/90 border-red-500/50' :
                                    n.type === 'warning' ? 'bg-yellow-900/90 border-yellow-500/50' :
                                        n.type === 'success' ? 'bg-green-900/90 border-green-500/50' :
                                            'bg-blue-900/90 border-blue-500/50'
                            }`}
                        >
              <span className="text-xl">
                {n.type === 'error' ? '❌' : n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : 'ℹ️'}
              </span>
                            <p className="text-sm">{n.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Left Panel */}
            <aside className="w-[480px] bg-[#111] border-r border-white/10 flex flex-col z-10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-gradient-to-b from-black/80 to-transparent border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                                <div className="w-10 h-1.5 bg-white rounded-full"></div>
                                <div className="w-10 h-1.5 bg-[#8B122B] rounded-full"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black italic tracking-tighter">
                                    MAVA <span className="text-[#8B122B]">PRO</span>
                                </h1>
                                <p className="text-[8px] text-white/30 uppercase tracking-widest">Logistics Calculator v2.0</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <span className="text-lg">📋</span>
                        </button>
                    </div>

                    {/* Transport Selection */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {Object.entries(VEHICLES).map(([type, list]) => (
                            <button
                                key={type}
                                onClick={() => setSelectedVehicle(list[0])}
                                className={`p-2 rounded-lg text-[9px] font-bold uppercase transition-all ${
                                    selectedVehicle.type === type ? 'bg-[#8B122B] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
                                }`}
                            >
                                {type === 'sea' ? '🚢' : type === 'road' ? '🚛' : type === 'air' ? '✈️' : '🚂'}
                                <span className="ml-1">{type}</span>
                            </button>
                        ))}
                    </div>

                    <select
                        className="w-full bg-black border border-white/20 p-3 rounded-lg text-xs font-bold focus:border-[#8B122B] outline-none mb-3"
                        value={`${selectedVehicle.type}:${selectedVehicle.id}`}
                        onChange={(e) => {
                            const [type, id] = e.target.value.split(':');
                            setSelectedVehicle(VEHICLES[type].find(v => v.id === id)!);
                        }}
                    >
                        {Object.entries(VEHICLES).map(([group, list]) => (
                            <optgroup key={group} label={group.toUpperCase()} className="bg-[#111]">
                                {list.map(v => (
                                    <option key={v.id} value={`${group}:${v.id}`}>
                                        {v.name} ({v.dim[0]}×{v.dim[1]}×{v.dim[2]}m | Max: {v.maxW}T)
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>

                    {/* Route Selection */}
                    <select
                        className="w-full bg-black border border-white/20 p-3 rounded-lg text-xs font-bold focus:border-[#8B122B] outline-none"
                        value={selectedRoute.id}
                        onChange={(e) => setSelectedRoute(ROUTES.find(r => r.id === e.target.value)!)}
                    >
                        {ROUTES.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.from} → {r.to} ({r.distance.toLocaleString()} km | ~{r.transitDays} days)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 px-4 py-3 bg-black/50 border-b border-white/5">
                    <TabButton active={activeTab === 'cargo'} onClick={() => setActiveTab('cargo')} icon="📦">Грузы</TabButton>
                    <TabButton active={activeTab === 'costs'} onClick={() => setActiveTab('costs')} icon="💰">Стоимость</TabButton>
                    <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon="⚙️">Настройки</TabButton>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {/* Cargo Tab */}
                        {activeTab === 'cargo' && (
                            <motion.div
                                key="cargo"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 space-y-4"
                            >
                                {/* Templates */}
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <p className="text-[9px] text-white/40 uppercase font-bold mb-2">Быстрое добавление шаблонов</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CARGO_TEMPLATES.slice(0, 6).map((t, i) => (
                                            <button
                                                key={i}
                                                onClick={() => addCargo(t)}
                                                className="px-2 py-1 bg-black/50 rounded text-[8px] font-bold hover:bg-[#8B122B] transition-all"
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cargo List */}
                                <AnimatePresence>
                                    {cargoList.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-white/5 border-l-4 rounded-r-xl overflow-hidden group"
                                            style={{ borderLeftColor: item.color }}
                                        >
                                            {/* Header */}
                                            <div className="flex justify-between items-center p-3 bg-black/30">
                                                <input
                                                    className="bg-transparent font-bold text-sm outline-none focus:text-[#8B122B] flex-1"
                                                    value={item.name}
                                                    onChange={(e) => updateCargo(item.id, 'name', e.target.value)}
                                                />
                                                <div className="flex gap-1">
                                                    <button onClick={() => duplicateCargo(item.id)} className="p-1 opacity-40 hover:opacity-100 transition-all">📋</button>
                                                    <button onClick={() => removeCargo(item.id)} className="p-1 opacity-40 hover:opacity-100 hover:text-red-400 transition-all">✕</button>
                                                </div>
                                            </div>

                                            <div className="p-3 space-y-3">
                                                {/* Dimensions */}
                                                <div className="grid grid-cols-5 gap-2">
                                                    {['qty', 'l', 'w', 'h', 'wt'].map(f => (
                                                        <div key={f}>
                                                            <p className="text-[7px] text-white/30 uppercase mb-1">
                                                                {f === 'qty' ? 'Шт' : f === 'wt' ? 'Вес(т)' : f.toUpperCase()}
                                                            </p>
                                                            <input
                                                                type="number"
                                                                step={f === 'qty' ? 1 : 0.1}
                                                                min={f === 'qty' ? 1 : 0.01}
                                                                className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs text-center font-mono"
                                                                value={item[f as keyof CargoItem]}
                                                                onChange={(e) => updateCargo(item.id, f as keyof CargoItem, parseFloat(e.target.value) || 0)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Unit & Value */}
                                                <div className="grid grid-cols-3 gap-2">
                                                    <select
                                                        className="bg-black/50 text-[10px] p-2 rounded border border-white/10"
                                                        value={item.unit}
                                                        onChange={(e) => updateCargo(item.id, 'unit', e.target.value)}
                                                    >
                                                        <option value="m">Метры</option>
                                                        <option value="cm">Сантиметры</option>
                                                    </select>
                                                    <div className="col-span-2 flex bg-black/50 rounded border border-white/10 overflow-hidden">
                                                        <input
                                                            type="number"
                                                            className="flex-1 bg-transparent p-2 text-xs text-center font-mono"
                                                            value={item.value}
                                                            onChange={(e) => updateCargo(item.id, 'value', parseFloat(e.target.value) || 0)}
                                                        />
                                                        <span className="bg-[#8B122B] px-3 flex items-center text-[8px] font-bold">USD</span>
                                                    </div>
                                                </div>

                                                {/* Flags */}
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => updateCargo(item.id, 'stackable', !item.stackable)}
                                                        className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${
                                                            item.stackable ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'
                                                        }`}
                                                    >
                                                        📦 Штабелируемый
                                                    </button>
                                                    <button
                                                        onClick={() => updateCargo(item.id, 'fragile', !item.fragile)}
                                                        className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${
                                                            item.fragile ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/30'
                                                        }`}
                                                    >
                                                        ⚡ Хрупкий
                                                    </button>
                                                    <button
                                                        onClick={() => updateCargo(item.id, 'hazard', !item.hazard)}
                                                        className={`px-2 py-1 rounded text-[8px] font-bold transition-all ${
                                                            item.hazard ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/30'
                                                        }`}
                                                    >
                                                        ☠️ Опасный
                                                    </button>
                                                    <input
                                                        type="color"
                                                        value={item.color}
                                                        onChange={(e) => updateCargo(item.id, 'color', e.target.value)}
                                                        className="w-6 h-6 rounded cursor-pointer"
                                                    />
                                                </div>

                                                {/* Hazard Class */}
                                                {item.hazard && (
                                                    <select
                                                        className="w-full bg-red-900/30 text-[10px] p-2 rounded border border-red-500/30"
                                                        value={item.hazardClass || ''}
                                                        onChange={(e) => updateCargo(item.id, 'hazardClass', e.target.value)}
                                                    >
                                                        <option value="">Выберите класс опасности</option>
                                                        {HAZARD_CLASSES.map(h => (
                                                            <option key={h.id} value={h.id}>{h.icon} Class {h.id}: {h.name}</option>
                                                        ))}
                                                    </select>
                                                )}

                                                {/* Calculated values */}
                                                <div className="flex gap-4 text-[9px] text-white/40 pt-2 border-t border-white/5">
                                                    <span>V: {calculateCBM(item.l, item.w, item.h, item.qty, item.unit).toFixed(3)} m³</span>
                                                    <span>W: {(item.wt * item.qty).toFixed(2)} T</span>
                                                    <span>Val: ${(item.value * item.qty).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Add Cargo Button */}
                                <button
                                    onClick={() => addCargo()}
                                    className="w-full border-2 border-dashed border-white/10 p-4 rounded-xl text-[10px] font-bold text-white/30 hover:border-[#8B122B] hover:text-[#8B122B] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <span className="text-xl">+</span> Добавить груз
                                </button>

                                {cargoList.length > 0 && (
                                    <button
                                        onClick={clearAllCargo}
                                        className="w-full text-[9px] text-red-400/50 hover:text-red-400 transition-all py-2"
                                    >
                                        Очистить все грузы
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* Costs Tab */}
                        {activeTab === 'costs' && (
                            <motion.div
                                key="costs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 space-y-4"
                            >
                                {/* Cost Breakdown */}
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Расшифровка стоимости</p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Базовая ставка</span>
                                            <span className="font-mono">{formatCurrency(calculations.baseCost)}</span>
                                        </div>
                                        {includeInsurance && calculations.insuranceCost > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/60">Страхование груза</span>
                                                <span className="font-mono">{formatCurrency(calculations.insuranceCost)}</span>
                                            </div>
                                        )}
                                        {includeCustoms && (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/60">Таможенная пошлина ({(customsDutyRate * 100).toFixed(0)}%)</span>
                                                    <span className="font-mono">{formatCurrency(calculations.customsCost)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/60">НДС ({(vatRate * 100).toFixed(0)}%)</span>
                                                    <span className="font-mono">{formatCurrency(calculations.vatCost)}</span>
                                                </div>
                                            </>
                                        )}
                                        {calculations.hazardSurcharge > 0 && (
                                            <div className="flex justify-between text-sm text-yellow-400">
                                                <span>Надбавка за опасный груз</span>
                                                <span className="font-mono">{formatCurrency(calculations.hazardSurcharge)}</span>
                                            </div>
                                        )}
                                        {calculations.oversizeSurcharge > 0 && (
                                            <div className="flex justify-between text-sm text-orange-400">
                                                <span>Надбавка за негабарит</span>
                                                <span className="font-mono">{formatCurrency(calculations.oversizeSurcharge)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-white/10 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">ИТОГО:</span>
                                            <span className="text-2xl font-black text-[#8B122B]">{formatCurrency(calculations.totalCost)}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-white/40 mt-1">
                                            <span>В {selectedCurrency}:</span>
                                            <span className="font-mono">{formatCurrency(calculations.convertedCost, selectedCurrency)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Currency Selection */}
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-[10px] font-bold text-white/40 uppercase mb-3">Валюта расчета</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(CURRENCIES).map(curr => (
                                            <button
                                                key={curr}
                                                onClick={() => setSelectedCurrency(curr)}
                                                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${
                                                    selectedCurrency === curr ? 'bg-[#8B122B] text-white' : 'bg-black/50 text-white/40 hover:text-white'
                                                }`}
                                            >
                                                {curr}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cost Settings */}
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Параметры расчета</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Включить страхование</span>
                                        <button
                                            onClick={() => setIncludeInsurance(!includeInsurance)}
                                            className={`w-12 h-6 rounded-full transition-all ${includeInsurance ? 'bg-[#8B122B]' : 'bg-white/10'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full transition-all ${includeInsurance ? 'ml-6' : 'ml-0.5'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Включить таможню</span>
                                        <button
                                            onClick={() => setIncludeCustoms(!includeCustoms)}
                                            className={`w-12 h-6 rounded-full transition-all ${includeCustoms ? 'bg-[#8B122B]' : 'bg-white/10'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full transition-all ${includeCustoms ? 'ml-6' : 'ml-0.5'}`} />
                                        </button>
                                    </div>

                                    {includeCustoms && (
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div>
                                                <p className="text-[8px] text-white/30 uppercase mb-1">Пошлина %</p>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                    value={customsDutyRate * 100}
                                                    onChange={(e) => setCustomsDutyRate(parseFloat(e.target.value) / 100 || 0)}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-white/30 uppercase mb-1">НДС %</p>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                    value={vatRate * 100}
                                                    onChange={(e) => setVatRate(parseFloat(e.target.value) / 100 || 0)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[8px] text-white/30 uppercase mb-1">Своя ставка (опционально)</p>
                                        <input
                                            type="number"
                                            min="0"
                                            step="10"
                                            placeholder={`Базовая: ${selectedVehicle.baseRate} ${selectedVehicle.currency}`}
                                            className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                            value={customRate || ''}
                                            onChange={(e) => setCustomRate(e.target.value ? parseFloat(e.target.value) : null)}
                                        />
                                    </div>
                                </div>

                                {/* Transit Time */}
                                <div className="bg-gradient-to-r from-[#8B122B]/20 to-transparent rounded-xl p-4 border border-[#8B122B]/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase">Срок доставки</p>
                                            <p className="text-2xl font-black">{calculations.transitDays} <span className="text-sm font-normal opacity-50">дней</span></p>
                                        </div>
                                        <div className="text-4xl">
                                            {selectedVehicle.type === 'sea' ? '🚢' : selectedVehicle.type === 'road' ? '🚛' : selectedVehicle.type === 'air' ? '✈️' : '🚂'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 space-y-4"
                            >
                                {/* Oversize Mode */}
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">Режим Негабарит</p>
                                            <p className="text-[10px] text-white/40">Расчет осевых нагрузок и разрешений</p>
                                        </div>
                                        <button
                                            onClick={() => setOversizeMode(!oversizeMode)}
                                            className={`w-12 h-6 rounded-full transition-all ${oversizeMode ? 'bg-[#8B122B]' : 'bg-white/10'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full transition-all ${oversizeMode ? 'ml-6' : 'ml-0.5'}`} />
                                        </button>
                                    </div>

                                    {oversizeMode && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-3 pt-3 border-t border-white/10"
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-[8px] text-white/30 uppercase mb-1">Оси тягача</p>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                        value={oversizeParams.tractorAxles}
                                                        onChange={(e) => setOversizeParams({...oversizeParams, tractorAxles: parseInt(e.target.value) || 1})}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-white/30 uppercase mb-1">Оси прицепа</p>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                        value={oversizeParams.trailerAxles}
                                                        onChange={(e) => setOversizeParams({...oversizeParams, trailerAxles: parseInt(e.target.value) || 1})}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-white/30 uppercase mb-1">Вес тягача (т)</p>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                        value={oversizeParams.tractorW}
                                                        onChange={(e) => setOversizeParams({...oversizeParams, tractorW: parseFloat(e.target.value) || 0})}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-white/30 uppercase mb-1">Вес прицепа (т)</p>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                        value={oversizeParams.trailerW}
                                                        onChange={(e) => setOversizeParams({...oversizeParams, trailerW: parseFloat(e.target.value) || 0})}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-white/30 uppercase mb-1">Макс. нагрузка на ось (т)</p>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="0.5"
                                                    className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs"
                                                    value={oversizeParams.maxAxleLoad}
                                                    onChange={(e) => setOversizeParams({...oversizeParams, maxAxleLoad: parseFloat(e.target.value) || 9})}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setOversizeParams({...oversizeParams, escortRequired: !oversizeParams.escortRequired})}
                                                    className={`flex-1 p-2 rounded text-[9px] font-bold ${oversizeParams.escortRequired ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/40'}`}
                                                >
                                                    🚗 Эскорт
                                                </button>
                                                <button
                                                    onClick={() => setOversizeParams({...oversizeParams, permitRequired: !oversizeParams.permitRequired})}
                                                    className={`flex-1 p-2 rounded text-[9px] font-bold ${oversizeParams.permitRequired ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}
                                                >
                                                    📋 Разрешение
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* 3D View Settings */}
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Настройки 3D вида</p>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setIsXRay(!isXRay)}
                                            className={`p-2 rounded text-[9px] font-bold ${isXRay ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}
                                        >
                                            🔬 X-Ray
                                        </button>
                                        <button
                                            onClick={() => setShowGrid(!showGrid)}
                                            className={`p-2 rounded text-[9px] font-bold ${showGrid ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}
                                        >
                                            ⊞ Сетка
                                        </button>
                                        <button
                                            onClick={() => setShowAxes(!showAxes)}
                                            className={`p-2 rounded text-[9px] font-bold ${showAxes ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40'}`}
                                        >
                                            ⟁ Оси
                                        </button>
                                        <button
                                            onClick={() => setAutoRotate(!autoRotate)}
                                            className={`p-2 rounded text-[9px] font-bold ${autoRotate ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/40'}`}
                                        >
                                            🔄 Вращение
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-[8px] text-white/30 uppercase mb-2">Ракурс камеры</p>
                                        <div className="flex gap-2">
                                            {(['perspective', 'top', 'front', 'side'] as const).map(preset => (
                                                <button
                                                key={preset}
                                             onClick={() => setCameraPreset(preset)}
                                             className={`flex-1 p-2 rounded text-[9px] font-bold capitalize ${
                                                 cameraPreset === preset ? 'bg-[#8B122B] text-white' : 'bg-white/5 text-white/40'
                                             }`}
                                        >
                                            {preset === 'perspective' ? '3D' : preset === 'top' ? '⬇️' : preset === 'front' ? '➡️' : '⬆️'}
                                        </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            </motion.div>
                            )}
                    </AnimatePresence>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-black border-t border-white/10 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={saveCalculation} className="p-2 bg-[#8B122B] rounded text-[9px] font-bold hover:bg-[#a01530] transition-all">
                            💾 Сохранить
                        </button>
                        <button onClick={exportToJSON} className="p-2 bg-white/5 rounded text-[9px] font-bold hover:bg-white/10 transition-all">
                            📄 JSON
                        </button>
                        <button onClick={exportToCSV} className="p-2 bg-white/5 rounded text-[9px] font-bold hover:bg-white/10 transition-all">
                            📊 CSV
                        </button>
                    </div>
                    <button className="w-full bg-white text-black p-3 rounded-lg text-sm font-black uppercase hover:bg-[#8B122B] hover:text-white transition-all">
                        📤 Сформировать заявку
                    </button>
                </div>
            </aside>

            {/* Main 3D View */}
            <main className="flex-1 relative">
                <div ref={mountRef} className="w-full h-full" />

                {/* Stats HUD */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex gap-8 shadow-2xl">
                        <StatCard
                            icon="⚖️"
                            label="Вес груза"
                            value={calculations.totalWeight.toFixed(1)}
                            unit="T"
                            warning={calculations.isOverweight}
                            info={`Максимум: ${selectedVehicle.maxW}T`}
                        />
                        <div className="w-px bg-white/10 self-stretch" />
                        <StatCard
                            icon="📦"
                            label="Объем"
                            value={calculations.totalVolume}
                            unit="m³"
                            info={`Контейнер: ${calculations.containerVolume} m³`}
                        />
                        <div className="w-px bg-white/10 self-stretch" />
                        <StatCard
                            icon="📊"
                            label="Заполнение"
                            value={calculations.fillPercent}
                            unit="%"
                            warning={calculations.isOverfilled}
                        />
                        {oversizeMode && (
                            <>
                                <div className="w-px bg-white/10 self-stretch" />
                                <StatCard
                                    icon="🎯"
                                    label="Нагр. на ось"
                                    value={calculations.axleLoad}
                                    unit="T"
                                    warning={calculations.axleOverload}
                                    info={`Максимум: ${oversizeParams.maxAxleLoad}T`}
                                />
                            </>
                        )}
                        <div className="w-px bg-white/10 self-stretch" />
                        <StatCard
                            icon="💰"
                            label="Стоимость"
                            value={formatCurrency(calculations.totalCost)}
                            info="Итоговая сумма"
                        />
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="absolute top-6 left-6 w-64 space-y-3 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <ProgressBar value={calculations.totalWeight} max={selectedVehicle.maxW} label="Вес" />
                    <ProgressBar value={parseFloat(calculations.fillPercent)} max={100} label="Заполнение" />
                </div>

                {/* Legend */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-2">
                    <p className="text-[9px] font-bold text-white/40 uppercase mb-3">Легенда</p>
                    <div className="flex items-center gap-3 text-[10px]">
                        <div className="w-3 h-3 bg-[#8B122B] rounded-sm"></div>
                        <span>Тяжелый груз (&gt;5т)</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                        <div className="w-3 h-3 bg-[#444] rounded-sm"></div>
                        <span>Обычный груз</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                        <div className="w-3 h-3 bg-[#ff4444] rounded-sm"></div>
                        <span>Опасный груз</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                        <div className="w-3 h-3 bg-[#ffaa44] rounded-sm"></div>
                        <span>Хрупкий груз</span>
                    </div>
                    {oversizeMode && (
                        <div className="flex items-center gap-3 text-[10px]">
                            <div className="w-3 h-3 bg-[#ffd700] rounded-full"></div>
                            <span>Центр тяжести</span>
                        </div>
                    )}
                </div>

                {/* Route Info */}
                <div className="absolute bottom-8 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <p className="text-[9px] text-white/40 uppercase mb-1">Маршрут</p>
                    <p className="font-bold">{selectedRoute.from} → {selectedRoute.to}</p>
                    <p className="text-[10px] text-white/40 mt-1">{selectedRoute.distance.toLocaleString()} km | ~{calculations.transitDays} дней</p>
                </div>

                {/* Vehicle Info */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 flex items-center gap-4">
          <span className="text-2xl">
            {selectedVehicle.type === 'sea' ? '🚢' : selectedVehicle.type === 'road' ? '🚛' : selectedVehicle.type === 'air' ? '✈️' : '🚂'}
          </span>
                    <div>
                        <p className="font-bold">{selectedVehicle.name}</p>
                        <p className="text-[10px] text-white/40">
                            {selectedVehicle.dim[0]} × {selectedVehicle.dim[1]} × {selectedVehicle.dim[2]}m | Max: {selectedVehicle.maxW}T
                        </p>
                    </div>
                </div>
            </main>

            {/* History Sidebar */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="absolute right-0 top-0 h-full w-80 bg-[#111] border-l border-white/10 z-20 shadow-2xl"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="font-bold">История расчетов</h2>
                            <button onClick={() => setShowHistory(false)} className="p-1 hover:text-[#8B122B]">✕</button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
                            {calculationHistory.length === 0 ? (
                                <p className="text-white/30 text-sm text-center py-8">Нет сохраненных расчетов</p>
                            ) : (
                                calculationHistory.map(calc => (
                                    <div key={calc.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <p className="text-[9px] text-white/30">{calc.date}</p>
                                        <p className="font-bold text-sm">{calc.vehicle}</p>
                                        <p className="text-[10px] text-white/50">{calc.route}</p>
                                        <div className="flex justify-between mt-2 text-[10px]">
                                            <span>{calc.totalWeight.toFixed(1)}T</span>
                                            <span>{calc.totalVolume.toFixed(2)}m³</span>
                                            <span className="text-[#8B122B] font-bold">{formatCurrency(calc.totalCost)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 18, 43, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 18, 43, 0.8);
                }
            `}</style>
        </div>
    );
};

export default MavaLogisticsPro;