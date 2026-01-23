import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, ArrowRight, CheckCircle, AlertTriangle, 
  Home, Building, Briefcase, ChevronLeft, ChevronRight,
  Box, Armchair, Utensils, Bed, Bath, LayoutGrid, 
  Dog, Mail, Phone, User, AlertCircle,
  Sliders, Plus
} from 'lucide-react';

// --- Types & Constants ---

type PropertyType = 'Studio' | '1 Bed' | '2 Bed' | '3 Bed' | '4+ Bed' | 'Office' | 'Shop';
type BuildingType = 'Flat' | 'House' | 'Commercial';
type CleaningType = 'Regular' | 'Deep' | 'End of Tenancy' | 'Move-in/out' | 'After Renovation' | 'Commercial';
type KitchenSize = 'Small' | 'Medium' | 'Large';
type Condition = 'Light' | 'Medium' | 'Heavy' | 'Extreme';
type CommercialSize = 'Small' | 'Medium' | 'Large';
type RegularSize = 'Small' | 'Medium' | 'Large';
type EoTSize = 'Small' | 'Medium' | 'Large';

interface EstimateForm {
  // Contact Info
  name: string;
  email: string;
  phone: string;

  // Step 1: Basics
  propertyType: PropertyType;
  buildingType: BuildingType;
  sqFt: number | '';
  
  // Step 2: Cleaning Type
  cleaningType: CleaningType;

  // Step 3: Rooms (Skipped for Move-in/out & Commercial & Deep & EoT & Regular)
  bedrooms: number;
  bathrooms: number;
  kitchenSize: KitchenSize;
  livingRooms: number;
  hallways: number;
  utilityRooms: number;

  // Step 4: Extras (Booleans)
  oven: boolean;
  fridge: boolean;
  cupboards: boolean;
  insideWindows: boolean;
  washingMachine: boolean;
  carpet: boolean;
  upholstery: boolean;
  mattress: boolean;
  balcony: boolean;
  garage: boolean;
  wasteRemoval: boolean;

  // Step 5: Condition (Skipped for most special flows)
  condition: Condition;
  hasPets: boolean;
  hasStainsOrOdors: boolean;
  
  // Step 6: Furniture (Skipped for most special flows)
  isFurnished: boolean;
  moveFurniture: boolean;
  cleanUnderHeavy: boolean;
  hasFragileItems: boolean;

  // Hidden/Default Access Fields
  floorNumber: number;
  hasLift: boolean;
  parkingAvailable: boolean;
  congestionCharges: boolean;
  outsideArea: boolean;

  // Commercial Specifics
  commercialSize: CommercialSize;
  highTraffic: boolean; // Shop, gym, restaurant
  heavySoiling: boolean; // Grease, heavy dirt
  afterHours: boolean; // Weekend/Evening access
  commercialKitchen: boolean; // Deep clean
  commercialToilets: boolean; // Deep clean

  // Deep & EoT Specifics
  steamCleaning: boolean; // Special machine

  // Regular Specifics
  regularSize: RegularSize;
  
  // End of Tenancy Specifics
  eotSize: EoTSize;
}

const INITIAL_STATE: EstimateForm = {
  name: '',
  email: '',
  phone: '',
  propertyType: '2 Bed',
  buildingType: 'House',
  sqFt: '',
  cleaningType: 'Regular', // Changed default to Regular
  bedrooms: 2,
  bathrooms: 1, 
  kitchenSize: 'Medium',
  livingRooms: 1,
  hallways: 1,
  utilityRooms: 0,
  oven: false,
  fridge: false,
  cupboards: false,
  insideWindows: false,
  washingMachine: false,
  carpet: false,
  upholstery: false,
  mattress: false,
  balcony: false,
  garage: false,
  wasteRemoval: false,
  condition: 'Medium',
  hasPets: false,
  hasStainsOrOdors: false,
  isFurnished: false, 
  moveFurniture: false,
  cleanUnderHeavy: false,
  hasFragileItems: false,
  floorNumber: 0,
  hasLift: false,
  parkingAvailable: true,
  congestionCharges: false,
  outsideArea: false,
  
  // Commercial Defaults
  commercialSize: 'Medium',
  highTraffic: false,
  heavySoiling: false,
  afterHours: false,
  commercialKitchen: false,
  commercialToilets: false,

  // Deep & EoT Defaults
  steamCleaning: false,

  // Regular Defaults
  regularSize: 'Medium',
  
  // EoT Defaults
  eotSize: 'Medium',
};

// --- Helper: Check flows ---
const isMoveInMoveOut = (type: CleaningType) => type === 'Move-in/out';
const isCommercial = (type: CleaningType) => type === 'Commercial';
const isDeepClean = (type: CleaningType) => type === 'Deep';
const isEndOfTenancy = (type: CleaningType) => type === 'End of Tenancy';
const isRegular = (type: CleaningType) => type === 'Regular';
const isSpecialFlow = (type: CleaningType) => isMoveInMoveOut(type) || isCommercial(type) || isDeepClean(type) || isEndOfTenancy(type) || isRegular(type);

// --- Pricing Logic ---
const calculateEstimate = (form: EstimateForm) => {
  let total = 0;

  // --- SPECIAL LOGIC: END OF TENANCY ---
  if (isEndOfTenancy(form.cleaningType)) {
    // 1. Base Prices (Wolverhampton)
    // Small: £120, Medium: £170, Large: £230
    let base = 170;
    if (form.eotSize === 'Small') base = 120;
    if (form.eotSize === 'Large') base = 230;

    // 2. Adjustments
    // Light dirt: -10%
    if (form.condition === 'Light') base *= 0.90;
    // Heavy dirt: +25%
    if (form.condition === 'Heavy') base *= 1.25;
    // Extra heavy dirt (Extreme): +40%
    if (form.condition === 'Extreme') base *= 1.40;
    
    // Pets: +15%
    if (form.hasPets) base *= 1.15;

    total = base;

    // 3. Extras
    if (form.oven) total += 45;
    if (form.insideWindows) total += 25;
    if (form.carpet) total += 70; // Assume 2 rooms @ £35 if unknown
    
    // Additional Optional Extras
    if (form.fridge) total += 25; 
    if (form.cupboards) total += 30; 
    if (form.upholstery) total += 45;
    if (form.mattress) total += 35;
    if (form.balcony) total += 30;
    if (form.garage) total += 40;
    if (form.wasteRemoval) total += 20;
    
    // Special machines
    if (form.steamCleaning) total += 45; 

    // 4. Access
    if ((form.floorNumber > 0 && !form.hasLift) || !form.parkingAvailable) {
      total += 20;
    }

    return Math.round(total);
  }

  // --- SPECIAL LOGIC: REGULAR CLEANING ---
  if (isRegular(form.cleaningType)) {
    // 1. Base Prices (Wolverhampton)
    // Small: £50, Medium: £70, Large: £90
    let base = 70;
    if (form.regularSize === 'Small') base = 50;
    if (form.regularSize === 'Large') base = 90;

    // 2. Adjustments
    // Light dirt: -10%
    if (form.condition === 'Light') base *= 0.90;
    // Heavy dirt: +20%
    if (form.condition === 'Heavy' || form.condition === 'Extreme') base *= 1.20;
    // Pets: +15%
    if (form.hasPets) base *= 1.15;

    total = base;

    // 3. Extras
    if (form.oven) total += 45;
    if (form.carpet) total += 70; // Assume 2 rooms @ £35
    if (form.insideWindows) total += 25;

    // 4. Access (stairs or no parking): +£20
    if ((form.floorNumber > 0 && !form.hasLift) || !form.parkingAvailable) {
      total += 20;
    }

    return Math.round(total);
  }

  // --- SPECIAL LOGIC: DEEP CLEANING ---
  if (isDeepClean(form.cleaningType)) {
    // 1. Base Prices
    // Small: £80, Medium: £110, Large: £150
    let base = 110;
    if (['Studio', '1 Bed'].includes(form.propertyType)) base = 80;
    else if (['4+ Bed', 'Office', 'Shop'].includes(form.propertyType)) base = 150;

    // 2. Adjustments
    if (form.condition === 'Light') base *= 0.90;
    if (form.condition === 'Heavy' || form.condition === 'Extreme') base *= 1.25;
    if (form.hasPets) base *= 1.15;

    total = base;

    // 3. Extras
    if (form.oven) total += 45;
    if (form.carpet) total += 70; 
    if (form.insideWindows) total += 25;
    if (form.steamCleaning) total += 25; 

    // 4. Access
    if ((form.floorNumber > 0 && !form.hasLift) || !form.parkingAvailable) {
      total += 20;
    }

    return Math.round(total);
  }

  // --- SPECIAL LOGIC: COMMERCIAL ---
  if (isCommercial(form.cleaningType)) {
    // 1. Base Prices
    let base = 140;
    if (form.commercialSize === 'Small') base = 90;
    if (form.commercialSize === 'Large') base = 200;

    // 2. Adjustments
    if (form.highTraffic) base *= 1.20;
    if (form.heavySoiling) base *= 1.25;
    if (form.afterHours) base *= 1.15;

    total = base;

    // 3. Extras
    if (form.commercialKitchen) total += 40;
    if (form.commercialToilets) total += 30;
    if (form.carpet) total += 70; 
    if (form.insideWindows) total += 30;
    if (form.wasteRemoval) total += 20;

    // 4. Access
    if ((form.floorNumber > 0 && !form.hasLift) || !form.parkingAvailable) {
      total += 20;
    }

    return Math.round(total);
  }

  // --- SPECIAL LOGIC: MOVE-IN / MOVE-OUT ---
  if (isMoveInMoveOut(form.cleaningType)) {
    // 1. Base Prices
    let base = 140; 
    if (['Studio', '1 Bed'].includes(form.propertyType)) base = 100;
    else if (['4+ Bed', 'Office', 'Shop'].includes(form.propertyType)) base = 190;
    
    // 2. Adjustments
    if (form.isFurnished) {
      base *= 1.12;
    } else {
      base *= 0.90;
    }

    // Pets
    if (form.hasPets) {
      base *= 1.15;
    }

    total = base;

    // 3. Extras
    if (form.oven) total += 45;
    if (form.insideWindows) total += 25;
    if (form.carpet) total += 70; 

    // 4. Access
    if ((form.floorNumber > 0 && !form.hasLift) || !form.parkingAvailable) {
      total += 20;
    }
    if (form.outsideArea) total += 20;

    return Math.round(total);
  }

  // --- STANDARD LOGIC (After Renovation etc) ---

  // 1. Base Fixed Pricing 
  const baseRates: Record<PropertyType, number> = {
    'Studio': 105, '1 Bed': 105, '2 Bed': 140, '3 Bed': 185, '4+ Bed': 235, 'Office': 150, 'Shop': 150
  };
  
  let base = baseRates[form.propertyType];

  // Adjust Base based on Service Type
  total += base;

  // 2. Room Add-ons
  if (form.bathrooms > 1) {
      total += (form.bathrooms - 1) * 35;
  }
  
  if (form.kitchenSize === 'Small') total -= 15;
  if (form.kitchenSize === 'Large') total += 15;

  // 3. Extras
  if (form.oven) total += 50; 
  if (form.fridge) total += 25; 
  if (form.cupboards) total += 30; 
  if (form.washingMachine) total += 20; 
  if (form.insideWindows) total += 40; 
  if (form.wasteRemoval) total += 80;

  // 4. Floors & Soft Furnishings
  if (form.carpet) {
      const carpetCount = form.bedrooms + form.livingRooms;
      total += carpetCount * 32.5;
  }
  if (form.upholstery) total += 45;
  if (form.mattress) total += 32.5; 
  
  // 5. External/Other Areas
  if (form.balcony) total += 30;
  if (form.garage) total += 40;

  // 6. Condition Modifiers
  let modifier = 1.0;
  if (form.condition === 'Light') modifier -= 0.1;
  else if (form.condition === 'Heavy') modifier += 0.25;
  else if (form.condition === 'Extreme') modifier += 0.4;
  
  if (form.hasPets) modifier += 0.1;

  // 7. Furniture & Logistics
  if (form.isFurnished && ['End of Tenancy'].includes(form.cleaningType)) {
      modifier += 0.15;
  }
  if (!form.isFurnished) {
      modifier -= 0.1;
  }

  total *= modifier;

  // Flat Fee Logistics
  if (form.moveFurniture) total += 35; 
  if (form.floorNumber > 0 && !form.hasLift) total += 22.5; 
  if (!form.parkingAvailable) total += 20; 
  if (form.outsideArea) total += 17.5; 

  return Math.round(total);
};

export const Estimate: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EstimateForm>(INITIAL_STATE);
  const [estimatedPrice, setEstimatedPrice] = useState({ min: 0, max: 0 });
  const [validationError, setValidationError] = useState('');
  const [showRefineDeep, setShowRefineDeep] = useState(false); // Toggle for Deep Clean refinement
  const [showRefineEoT, setShowRefineEoT] = useState(false); // Toggle for EoT refinement
  const [showEoTExtras, setShowEoTExtras] = useState(false); // Toggle for EoT additional extras
  const [showRefineRegular, setShowRefineRegular] = useState(false); // Toggle for Regular refinement

  // Flows:
  // Standard: 1(Basics) -> 2(Type) -> 3(Rooms) -> 4(Extras) -> 5(Condition) -> 6(Furniture) -> 7(Contact) -> 8(Result)
  // Move-in:  1(Basics) -> 2(Type) -> 3(MoveInConfig) -> 4(Contact) -> 5(Result)
  // Commercial: 1(Basics) -> 2(Type) -> 3(CommercialConfig) -> 4(Contact) -> 5(Result)
  // Deep:     1(Basics) -> 2(Type) -> 3(DeepConfig) -> 4(Contact) -> 5(Result)
  // EoT:      1(Basics) -> 2(Type) -> 3(EoTConfig) -> 4(Contact) -> 5(Result)
  // Regular:  1(Basics) -> 2(Type) -> 3(RegularConfig) -> 4(Contact) -> 5(Result)

  const isSpecial = isSpecialFlow(formData.cleaningType);
  const totalSteps = isSpecial ? 5 : 8;
  const contactStepIndex = isSpecial ? 4 : 7;

  // Auto-set sizes based on property type
  useEffect(() => {
    const size = ['Studio', '1 Bed'].includes(formData.propertyType) ? 'Small' 
                : ['2 Bed', '3 Bed'].includes(formData.propertyType) ? 'Medium' 
                : 'Large';
    
    if (isRegular(formData.cleaningType)) {
        setFormData(prev => ({ ...prev, regularSize: size as RegularSize }));
    }
    if (isEndOfTenancy(formData.cleaningType)) {
        setFormData(prev => ({ ...prev, eotSize: size as EoTSize }));
    }
  }, [formData.cleaningType, formData.propertyType]);

  useEffect(() => {
    const price = calculateEstimate(formData);
    setEstimatedPrice({
      min: Math.round(price * 0.9),
      max: Math.round(price * 1.1)
    });
  }, [formData]);

  const update = (field: keyof EstimateForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationError) setValidationError('');
  };

  const saveLead = () => {
    // Generate simple ID
    const leadId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    
    let instructions = `ESTIMATE: £${estimatedPrice.min}-£${estimatedPrice.max}. `;
    
    if (isCommercial(formData.cleaningType)) {
        instructions += `COMMERCIAL: ${formData.commercialSize}, ${formData.highTraffic ? 'High Traffic' : 'Standard'}, ${formData.afterHours ? 'After Hours' : 'Std Hours'}. `;
    } else if (isDeepClean(formData.cleaningType)) {
        instructions += `DEEP CLEAN: ${formData.propertyType}. Extras: ${formData.oven ? 'Oven' : ''} ${formData.carpet ? 'Carpets' : ''}. Condition: ${formData.condition}. `;
    } else if (isEndOfTenancy(formData.cleaningType)) {
        instructions += `EOT CLEAN: ${formData.eotSize} (${formData.propertyType}). Extras: ${formData.oven ? 'Oven' : ''} ${formData.carpet ? 'Carpets' : ''}. Condition: ${formData.condition}. `;
    } else if (isRegular(formData.cleaningType)) {
        instructions += `REGULAR CLEAN: ${formData.regularSize} (${formData.propertyType}). Extras: ${formData.oven ? 'Oven' : ''} ${formData.carpet ? 'Carpets' : ''}. Condition: ${formData.condition}. `;
    } else {
        instructions += `Property: ${formData.propertyType} ${formData.buildingType}. `;
    }

    const newLead = {
        id: leadId,
        name: formData.name || 'Estimate Request',
        phone: formData.phone,
        email: formData.email,
        serviceType: formData.cleaningType,
        date: new Date().toISOString(),
        time: 'Any',
        instructions: instructions,
        status: 'New',
        submittedAt: new Date().toISOString()
    };

    const existingLeads = JSON.parse(localStorage.getItem('kl_leads') || '[]');
    localStorage.setItem('kl_leads', JSON.stringify([newLead, ...existingLeads]));
  };

  const nextStep = () => {
    // Validate Contact Info before proceeding to Result
    if (step === contactStepIndex) {
        if (!formData.email || !formData.phone) {
            setValidationError('Please provide your email and phone number to see your estimate.');
            return;
        }
        // Save the lead when they click calculate/next from contact step
        saveLead();
    }
    
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  
  // --- Render Functions ---

  const renderStep1_Basics = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Property Basics</h2>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">What type of property is it?</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Studio', '1 Bed', '2 Bed', '3 Bed', '4+ Bed', 'Office', 'Shop'].map((type) => (
            <button
              key={type}
              onClick={() => update('propertyType', type)}
              className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                formData.propertyType === type 
                ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Building Type</label>
        <div className="flex gap-4">
          {['Flat', 'House', 'Commercial'].map((type) => (
            <button
              key={type}
              onClick={() => update('buildingType', type)}
              className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                formData.buildingType === type 
                ? 'bg-brand-50 text-brand-700 border-brand-500 ring-1 ring-brand-500' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
              }`}
            >
              {type === 'Flat' && <Building className="w-4 h-4" />}
              {type === 'House' && <Home className="w-4 h-4" />}
              {type === 'Commercial' && <Briefcase className="w-4 h-4" />}
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Total Square Footage (Approx)
          <span className="text-slate-400 font-normal ml-2 text-xs">(Optional)</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={formData.sqFt}
            onChange={(e) => update('sqFt', e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 1500"
            className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">sq ft</span>
        </div>
      </div>
    </div>
  );

  const renderStep2_CleaningType = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Cleaning Type</h2>
      <p className="text-slate-500 text-sm">Select the service level that fits your needs.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'Regular', label: 'Regular Cleaning', desc: 'Standard dusting, vacuuming, and wiping. (£15-18/hr est)' },
          { id: 'Deep', label: 'Deep Cleaning', desc: 'Detailed clean including baseboards & corners. (£20-25/hr est)' },
          { id: 'End of Tenancy', label: 'End of Tenancy', desc: 'Full property reset for inspection. (£22-28/hr est)' },
          { id: 'Move-in/out', label: 'Move-in / Move-out', desc: 'Bundled package for empty/furnished homes.' },
          { id: 'After Renovation', label: 'After Renovation', desc: 'Dust removal and post-construction clean.' },
          { id: 'Commercial', label: 'Commercial Cleaning', desc: 'Office and retail space maintenance.' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => update('cleaningType', item.id)}
            className={`text-left p-4 rounded-xl border transition-all ${
              formData.cleaningType === item.id
              ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500'
              : 'bg-white border-slate-200 hover:border-brand-300'
            }`}
          >
            <div className={`font-bold text-lg mb-1 ${formData.cleaningType === item.id ? 'text-brand-700' : 'text-slate-800'}`}>
              {item.label}
            </div>
            <div className="text-sm text-slate-500">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3_Rooms = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Rooms & Areas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Bedrooms', key: 'bedrooms', icon: <Bed className="w-5 h-5" /> },
          { label: 'Bathrooms / Toilets', key: 'bathrooms', icon: <Bath className="w-5 h-5" /> },
          { label: 'Living Rooms', key: 'livingRooms', icon: <Armchair className="w-5 h-5" /> },
          { label: 'Hallways / Stairs', key: 'hallways', icon: <LayoutGrid className="w-5 h-5" /> },
          { label: 'Utility / Storage', key: 'utilityRooms', icon: <Box className="w-5 h-5" /> },
        ].map((room) => (
          <div key={room.key} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-slate-400">{room.icon}</div>
              <span className="font-bold text-slate-700">{room.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => update(room.key as keyof EstimateForm, Math.max(0, (formData[room.key as keyof EstimateForm] as number) - 1))}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >-</button>
              <span className="w-4 text-center font-bold">{formData[room.key as keyof EstimateForm] as number}</span>
              <button 
                onClick={() => update(room.key as keyof EstimateForm, (formData[room.key as keyof EstimateForm] as number) + 1)}
                className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 hover:bg-brand-200 flex items-center justify-center font-bold"
              >+</button>
            </div>
          </div>
        ))}

        {/* Kitchen Special Case */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Utensils className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-700">Kitchen Size</span>
            </div>
            <div className="flex gap-2">
              {['Small', 'Medium', 'Large'].map((size) => (
                <button
                  key={size}
                  onClick={() => update('kitchenSize', size)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.kitchenSize === size
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );

  const renderStep4_Extras = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Extra Services</h2>
      <p className="text-slate-500 text-sm">Select any additional appliances or areas.</p>
      
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'oven', label: 'Oven Cleaning' },
          { key: 'fridge', label: 'Fridge (Inside)' },
          { key: 'cupboards', label: 'Inside Cupboards' },
          { key: 'insideWindows', label: 'Inside Windows' },
          { key: 'washingMachine', label: 'Washing Machine/Dishwasher' },
          { key: 'carpet', label: 'Carpet Cleaning' },
          { key: 'upholstery', label: 'Sofa / Upholstery' },
          { key: 'mattress', label: 'Mattress Cleaning' },
          { key: 'balcony', label: 'Balcony / Patio' },
          { key: 'garage', label: 'Garage' },
          { key: 'wasteRemoval', label: 'Bin / Waste Removal' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => update(item.key as keyof EstimateForm, !formData[item.key as keyof EstimateForm])}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              formData[item.key as keyof EstimateForm]
              ? 'bg-brand-50 border-brand-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
               formData[item.key as keyof EstimateForm] ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300 bg-white'
            }`}>
              {formData[item.key as keyof EstimateForm] && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
            <span className={`font-medium text-sm ${formData[item.key as keyof EstimateForm] ? 'text-brand-900' : 'text-slate-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep5_Condition = () => (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Condition & Difficulty</h2>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-4">How dirty is the property?</label>
        <div className="space-y-3">
          {[
            { id: 'Light', label: 'Light', desc: 'Regular maintenance, minor dust (-10%)' },
            { id: 'Medium', label: 'Medium', desc: 'Visible dirt, standard clean.' },
            { id: 'Heavy', label: 'Heavy', desc: 'Thick dust, grime build-up (+25%)' },
            { id: 'Extreme', label: 'Extreme', desc: 'Grease, mold, deep stains (+40%)' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => update('condition', c.id)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                formData.condition === c.id
                ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500'
                : 'bg-white border-slate-200 hover:border-brand-300'
              }`}
            >
              <div>
                <span className={`font-bold block ${formData.condition === c.id ? 'text-brand-700' : 'text-slate-800'}`}>{c.label}</span>
                <span className="text-sm text-slate-500">{c.desc}</span>
              </div>
              {formData.condition === c.id && <CheckCircle className="w-5 h-5 text-brand-500" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => update('hasPets', !formData.hasPets)}
          className={`p-4 rounded-xl border text-left transition-all ${formData.hasPets ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200'}`}
        >
          <div className="font-bold text-slate-800 mb-1">Any Pets?</div>
          <p className="text-xs text-slate-500">Dog/Cat hair requiring removal (+10%).</p>
          <div className={`mt-2 w-10 h-6 rounded-full p-1 transition-colors ${formData.hasPets ? 'bg-amber-500' : 'bg-slate-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.hasPets ? 'translate-x-4' : ''}`}></div>
          </div>
        </button>

        <button
          onClick={() => update('hasStainsOrOdors', !formData.hasStainsOrOdors)}
          className={`p-4 rounded-xl border text-left transition-all ${formData.hasStainsOrOdors ? 'bg-red-50 border-red-400' : 'bg-white border-slate-200'}`}
        >
          <div className="font-bold text-slate-800 mb-1">Stains / Odors?</div>
          <p className="text-xs text-slate-500">Mould, limescale, strong smells.</p>
          <div className={`mt-2 w-10 h-6 rounded-full p-1 transition-colors ${formData.hasStainsOrOdors ? 'bg-red-500' : 'bg-slate-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.hasStainsOrOdors ? 'translate-x-4' : ''}`}></div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep6_Furniture = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Furniture & Moving</h2>
      
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {[
          { key: 'isFurnished', label: 'Is the property furnished?' },
          { key: 'moveFurniture', label: 'Do cleaners need to move furniture?' },
          { key: 'cleanUnderHeavy', label: 'Clean under heavy items?' },
          { key: 'hasFragileItems', label: 'Any fragile or expensive items?' },
        ].map((item, idx) => (
          <div key={item.key} className={`p-4 flex items-center justify-between ${idx !== 3 ? 'border-b border-slate-100' : ''}`}>
            <span className="font-medium text-slate-700">{item.label}</span>
            <div className="flex gap-2">
               <button 
                 onClick={() => update(item.key as keyof EstimateForm, true)}
                 className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${formData[item.key as keyof EstimateForm] ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                 Yes
               </button>
               <button 
                 onClick={() => update(item.key as keyof EstimateForm, false)}
                 className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${!formData[item.key as keyof EstimateForm] ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                 No
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- SPECIAL FLOW STEPS (Move-in/Move-out) ---

  const renderStep_MoveInConfig = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Move-in / Out Details</h2>
      <p className="text-slate-500 text-sm">
        This bundled service includes a deep clean of all rooms, inside cupboards, and skirting boards.
      </p>

      {/* Furnished Status */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 block">Is the property furnished?</span>
            <span className="text-xs text-slate-500">Affects pricing (-10% if empty)</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
               <button 
                 onClick={() => update('isFurnished', false)}
                 className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${!formData.isFurnished ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
               >
                 Empty
               </button>
               <button 
                 onClick={() => update('isFurnished', true)}
                 className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${formData.isFurnished ? 'bg-brand-500 shadow-sm text-white' : 'text-slate-500'}`}
               >
                 Furnished
               </button>
          </div>
      </div>

      {/* Pets */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Dog className="w-5 h-5"/></div>
             <div>
                <span className="font-bold text-slate-800 block">Any Pets?</span>
                <span className="text-xs text-slate-500">Requires extra detailing (+15%)</span>
             </div>
          </div>
          <div className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${formData.hasPets ? 'bg-amber-500' : 'bg-slate-200'}`} onClick={() => update('hasPets', !formData.hasPets)}>
             <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.hasPets ? 'translate-x-5' : ''}`}></div>
          </div>
      </div>

      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-4">Essential Add-ons</h3>
      
      <div className="grid grid-cols-1 gap-3">
         <button
            onClick={() => update('oven', !formData.oven)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.oven ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.oven ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.oven && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Oven Cleaning (+£45)</span>
            </div>
          </button>

          <button
            onClick={() => update('carpet', !formData.carpet)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.carpet ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.carpet ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.carpet && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Carpet Cleaning (+£70 est)</span>
            </div>
          </button>

          <button
            onClick={() => update('insideWindows', !formData.insideWindows)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.insideWindows ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.insideWindows ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.insideWindows && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Inside Windows (+£25)</span>
            </div>
          </button>
      </div>
    </div>
  );

  // --- SPECIAL FLOW STEPS (Deep Cleaning) ---

  const renderStep_DeepConfig = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Deep Cleaning Essentials</h2>
      <p className="text-slate-500 text-sm">
        Standard deep clean for <span className="font-bold text-slate-700">{formData.propertyType}</span>. Includes kitchen, bathrooms, living areas, edges & skirting.
      </p>

      {/* Main Add-ons */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-2">Optional Extras</h3>
      <div className="grid grid-cols-1 gap-3">
         <button
            onClick={() => update('oven', !formData.oven)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.oven ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.oven ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.oven && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Oven Cleaning (+£45)</span>
            </div>
          </button>

          <button
            onClick={() => update('carpet', !formData.carpet)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.carpet ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.carpet ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.carpet && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Carpet Cleaning (+£70 est)</span>
            </div>
          </button>

          <button
            onClick={() => update('insideWindows', !formData.insideWindows)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.insideWindows ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.insideWindows ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.insideWindows && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Inside Windows (+£25)</span>
            </div>
          </button>
      </div>

      {/* Refine Estimate Accordion */}
      <div className="mt-6 border-t border-slate-200 pt-6">
          <button 
             onClick={() => setShowRefineDeep(!showRefineDeep)}
             className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition"
          >
              <Sliders className="w-4 h-4" /> 
              {showRefineDeep ? 'Hide Refinement Options' : 'Refine Estimate'}
          </button>

          {showRefineDeep && (
             <div className="mt-4 space-y-4 animate-fadeIn">
                 {/* Dirt Level */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dirt Level</label>
                    <div className="flex gap-2">
                        {['Light', 'Medium', 'Heavy'].map((c) => (
                            <button
                                key={c}
                                onClick={() => update('condition', c)}
                                className={`flex-1 py-2 text-sm rounded-lg border transition ${
                                    formData.condition === c 
                                    ? 'bg-brand-600 text-white border-brand-600' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Toggles */}
                 <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => update('hasPets', !formData.hasPets)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            formData.hasPets ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        Has Pets? (+15%)
                     </button>
                     <button
                        onClick={() => update('parkingAvailable', !formData.parkingAvailable)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            !formData.parkingAvailable ? 'bg-red-50 border-red-400 text-red-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        No Parking/Stairs? (+£20)
                     </button>
                     <button
                        onClick={() => update('steamCleaning', !formData.steamCleaning)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            formData.steamCleaning ? 'bg-brand-50 border-brand-500 text-brand-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        Steam Cleaning (+£25)
                     </button>
                 </div>
             </div>
          )}
      </div>
    </div>
  );

  // --- SPECIAL FLOW STEPS (End of Tenancy) ---
  
  const renderStep_EoTConfig = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">End of Tenancy Essentials</h2>
      <p className="text-slate-500 text-sm">
        Full internal clean suitable for landlord handover. Includes inside cupboards, appliances, and skirting.
      </p>

      {/* Property Size Selector */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Property Size</label>
        <div className="grid grid-cols-3 gap-3">
           {(['Small', 'Medium', 'Large'] as const).map(size => (
               <button
                 key={size}
                 onClick={() => update('eotSize', size)}
                 className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                    formData.eotSize === size
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                 }`}
               >
                   <div className="font-bold">{size}</div>
                   <div className="text-[10px] opacity-80">
                       {size === 'Small' ? 'Studio/1 Bed' : size === 'Medium' ? '2-3 Bed' : '4+ Bed/Office'}
                   </div>
               </button>
           ))}
        </div>
      </div>

      {/* Main Add-ons */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-4">Essential Extras</h3>
      <div className="grid grid-cols-1 gap-3">
         <button
            onClick={() => update('oven', !formData.oven)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.oven ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.oven ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.oven && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Oven Cleaning (+£45)</span>
            </div>
          </button>

          <button
            onClick={() => update('carpet', !formData.carpet)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.carpet ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.carpet ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.carpet && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Carpet Cleaning (+£70 est)</span>
            </div>
          </button>

          <button
            onClick={() => update('insideWindows', !formData.insideWindows)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.insideWindows ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.insideWindows ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.insideWindows && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Inside Windows (+£25)</span>
            </div>
          </button>
      </div>
      
      {/* Add Extras Section */}
      <div className="mt-4">
        <button 
             onClick={() => setShowEoTExtras(!showEoTExtras)}
             className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition text-sm"
          >
              <Plus className="w-4 h-4" /> 
              {showEoTExtras ? 'Hide Extra Services' : 'Add More Extras'}
        </button>
        
        {showEoTExtras && (
            <div className="grid grid-cols-2 gap-3 mt-3 animate-fadeIn">
                {[
                    { key: 'fridge', label: 'Fridge', price: '£25' },
                    { key: 'cupboards', label: 'Cupboards', price: '£30' },
                    { key: 'upholstery', label: 'Upholstery', price: '£45' },
                    { key: 'mattress', label: 'Mattress', price: '£35' },
                    { key: 'balcony', label: 'Balcony', price: '£30' },
                    { key: 'garage', label: 'Garage', price: '£40' },
                    { key: 'wasteRemoval', label: 'Waste Removal', price: '£20' },
                ].map((item: any) => (
                    <button
                        key={item.key}
                        onClick={() => update(item.key, !formData[item.key as keyof EstimateForm])}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-full transition-all ${
                            formData[item.key as keyof EstimateForm]
                            ? 'bg-brand-50 border-brand-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex justify-between items-start w-full mb-1">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData[item.key as keyof EstimateForm] ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                                {formData[item.key as keyof EstimateForm] && <CheckCircle className="w-3 h-3" />}
                            </div>
                            <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded">{item.price}</span>
                        </div>
                        <span className={`font-medium text-xs ${formData[item.key as keyof EstimateForm] ? 'text-brand-900' : 'text-slate-600'}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Refine Estimate Accordion */}
      <div className="mt-6 border-t border-slate-200 pt-6">
          <button 
             onClick={() => setShowRefineEoT(!showRefineEoT)}
             className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition"
          >
              <Sliders className="w-4 h-4" /> 
              {showRefineEoT ? 'Hide Refinement Options' : 'Refine Estimate'}
          </button>

          {showRefineEoT && (
             <div className="mt-4 space-y-4 animate-fadeIn">
                 {/* Dirt Level */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dirt Level</label>
                    <div className="flex gap-2">
                        {['Light', 'Medium', 'Heavy', 'Extreme'].map((c) => (
                            <button
                                key={c}
                                onClick={() => update('condition', c)}
                                className={`flex-1 py-2 text-[10px] sm:text-xs rounded-lg border transition ${
                                    formData.condition === c 
                                    ? 'bg-brand-600 text-white border-brand-600' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Toggles */}
                 <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => update('hasPets', !formData.hasPets)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            formData.hasPets ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        Has Pets? (+15%)
                     </button>
                     <button
                        onClick={() => update('parkingAvailable', !formData.parkingAvailable)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            !formData.parkingAvailable ? 'bg-red-50 border-red-400 text-red-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        No Parking/Stairs? (+£20)
                     </button>
                     <button
                        onClick={() => update('steamCleaning', !formData.steamCleaning)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            formData.steamCleaning ? 'bg-brand-50 border-brand-500 text-brand-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        Steam Cleaning (+£45)
                     </button>
                 </div>
             </div>
          )}
      </div>
    </div>
  );

  // --- SPECIAL FLOW STEPS (Regular Cleaning) ---

  const renderStep_RegularConfig = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Regular Cleaning Essentials</h2>
      <p className="text-slate-500 text-sm">
        Standard recurring cleaning for maintaining your property.
      </p>

      {/* Property Size Selector */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Property Size</label>
        <div className="grid grid-cols-3 gap-3">
           {(['Small', 'Medium', 'Large'] as const).map(size => (
               <button
                 key={size}
                 onClick={() => update('regularSize', size)}
                 className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                    formData.regularSize === size
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                 }`}
               >
                   <div className="font-bold">{size}</div>
               </button>
           ))}
        </div>
      </div>

      {/* Main Add-ons */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-4">Optional Extras</h3>
      <div className="grid grid-cols-1 gap-3">
         <button
            onClick={() => update('oven', !formData.oven)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.oven ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.oven ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.oven && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Oven Cleaning (+£45)</span>
            </div>
          </button>

          <button
            onClick={() => update('carpet', !formData.carpet)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.carpet ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.carpet ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.carpet && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Carpet Cleaning (+£70 est)</span>
            </div>
          </button>

          <button
            onClick={() => update('insideWindows', !formData.insideWindows)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.insideWindows ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
               <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.insideWindows ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                  {formData.insideWindows && <CheckCircle className="w-3.5 h-3.5" />}
               </div>
               <span className="font-bold text-slate-700">Inside Windows (+£25)</span>
            </div>
          </button>
      </div>

      {/* Refine Estimate Accordion */}
      <div className="mt-6 border-t border-slate-200 pt-6">
          <button 
             onClick={() => setShowRefineRegular(!showRefineRegular)}
             className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition"
          >
              <Sliders className="w-4 h-4" /> 
              {showRefineRegular ? 'Hide Refinement Options' : 'Refine Estimate'}
          </button>

          {showRefineRegular && (
             <div className="mt-4 space-y-4 animate-fadeIn">
                 {/* Dirt Level */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dirt Level</label>
                    <div className="flex gap-2">
                        {['Light', 'Medium', 'Heavy'].map((c) => (
                            <button
                                key={c}
                                onClick={() => update('condition', c)}
                                className={`flex-1 py-2 text-sm rounded-lg border transition ${
                                    formData.condition === c 
                                    ? 'bg-brand-600 text-white border-brand-600' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Toggles */}
                 <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => update('hasPets', !formData.hasPets)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            formData.hasPets ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        Has Pets? (+15%)
                     </button>
                     <button
                        onClick={() => update('parkingAvailable', !formData.parkingAvailable)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                            !formData.parkingAvailable ? 'bg-red-50 border-red-400 text-red-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                     >
                        No Parking/Stairs? (+£20)
                     </button>
                 </div>
             </div>
          )}
      </div>
    </div>
  );

  // --- SPECIAL FLOW STEPS (Commercial) ---

  const renderStep_CommercialConfig = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">Commercial Details</h2>
      <p className="text-slate-500 text-sm">
        Customized package for offices, retail, and business premises.
      </p>

      {/* Property Size */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Approx. Property Size</label>
        <div className="grid grid-cols-3 gap-3">
           {(['Small', 'Medium', 'Large'] as const).map(size => (
               <button
                 key={size}
                 onClick={() => update('commercialSize', size)}
                 className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                    formData.commercialSize === size
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                 }`}
               >
                   <div className="font-bold">{size}</div>
                   <div className="text-[10px] opacity-80">
                       {size === 'Small' ? '<1,000 sq ft' : size === 'Medium' ? '1k-3k sq ft' : '3k+ sq ft'}
                   </div>
               </button>
           ))}
        </div>
      </div>

      {/* Usage & Condition */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-4">Usage & Condition</h3>
      <div className="grid grid-cols-1 gap-3">
         <button
            onClick={() => update('highTraffic', !formData.highTraffic)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.highTraffic ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div>
               <span className="font-bold text-slate-700 block">High Traffic / Food Service</span>
               <span className="text-xs text-slate-500">Shop, Gym, Restaurant, etc. (+20%)</span>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.highTraffic ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                {formData.highTraffic && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
          </button>

          <button
            onClick={() => update('heavySoiling', !formData.heavySoiling)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.heavySoiling ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div>
               <span className="font-bold text-slate-700 block">Heavy Dirt / Grease</span>
               <span className="text-xs text-slate-500">Requires deep scrubbing/degreasing (+25%)</span>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.heavySoiling ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                {formData.heavySoiling && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
          </button>

          <button
            onClick={() => update('afterHours', !formData.afterHours)}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${formData.afterHours ? 'bg-brand-50 border-brand-500' : 'bg-white border-slate-200'}`}
          >
            <div>
               <span className="font-bold text-slate-700 block">After-Hours / Weekend</span>
               <span className="text-xs text-slate-500">Cleaning outside std business hours (+15%)</span>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.afterHours ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                {formData.afterHours && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
          </button>
      </div>

      {/* Commercial Extras */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-4">Add-ons</h3>
      <div className="grid grid-cols-2 gap-3">
          {[
              { key: 'commercialKitchen', label: 'Kitchen Deep Clean', price: '£40' },
              { key: 'commercialToilets', label: 'Toilets Deep Clean', price: '£30' },
              { key: 'carpet', label: 'Carpet Cleaning', price: '£70 est' },
              { key: 'insideWindows', label: 'Inside Windows', price: '£30' },
              { key: 'wasteRemoval', label: 'Extra Waste Bags', price: '£20' },
              { key: 'parkingAvailable', label: 'No Parking / Stairs', price: '£20', inverse: true },
          ].map((item: any) => (
            <button
                key={item.key}
                onClick={() => update(item.key, !formData[item.key as keyof EstimateForm])}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between h-full transition-all ${
                    formData[item.key as keyof EstimateForm]
                    ? 'bg-brand-50 border-brand-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
            >
                <div className="flex justify-between items-start w-full mb-2">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData[item.key as keyof EstimateForm] ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300'}`}>
                        {formData[item.key as keyof EstimateForm] && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded">{item.price}</span>
                </div>
                <span className={`font-medium text-sm leading-tight ${formData[item.key as keyof EstimateForm] ? 'text-brand-900' : 'text-slate-600'}`}>
                    {item.label}
                </span>
            </button>
          ))}
      </div>
    </div>
  );

  // --- NEW CONTACT STEP (Replaces Access) ---
  const renderStep_Contact = () => (
    <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-800">Your Contact Details</h2>
        <p className="text-slate-500 text-sm">
            Please enter your details to view your estimated price.
        </p>

        {validationError && (
             <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {validationError}
            </div>
        )}

        <div className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        placeholder="John Doe"
                    />
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        placeholder="(555) 555-5555"
                    />
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        placeholder="john@example.com"
                    />
                </div>
             </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 leading-relaxed border border-blue-100">
            We use this information to send you the quote and contact you if needed. We respect your privacy.
        </div>
    </div>
  );


  const renderStep8_Result = () => (
    <div className="text-center animate-fadeIn">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10 text-brand-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Estimated Price Range</h2>
        <div className="flex items-center justify-center gap-2 text-5xl font-black text-brand-600 mb-4 tracking-tight">
            <span>£{estimatedPrice.min}</span>
            <span className="text-slate-300">-</span>
            <span>£{estimatedPrice.max}</span>
        </div>
        <p className="text-slate-500 max-w-lg mx-auto mb-8">
            {isCommercial(formData.cleaningType) 
                ? `Commercial bundled package for ${formData.commercialSize} property.`
                : isEndOfTenancy(formData.cleaningType)
                    ? `End-of-Tenancy cleaning for a ${formData.eotSize} property.`
                    : isRegular(formData.cleaningType) 
                        ? `Regular cleaning for a ${formData.regularSize} size property.`
                        : isDeepClean(formData.cleaningType) 
                            ? `Deep cleaning for a ${formData.propertyType} property.`
                            : isMoveInMoveOut(formData.cleaningType)
                                ? `Based on ${formData.propertyType} bundled service. Includes full internal clean.`
                                : `Based on ${formData.propertyType} ${formData.buildingType}, ${formData.cleaningType} clean, and selected extras.`
            }
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left max-w-2xl mx-auto mb-8">
            <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                <div>
                    <p className="font-bold text-yellow-800 text-sm mb-1">Disclaimer</p>
                    <p className="text-xs text-yellow-700 leading-relaxed">
                    This estimate assumes standard conditions. 
                    Heavy soiling, hazardous materials, or difficult access may incur additional charges.
                    Note: Final price confirmed after inspection.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link 
                to="/contact"
                className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brand-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
             >
                Book This Price <ArrowRight className="w-5 h-5" />
             </Link>
             <button 
               onClick={() => setStep(1)}
               className="bg-white text-slate-600 border border-slate-300 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all"
             >
                Start Over
             </button>
        </div>
    </div>
  );

  // --- Render Switcher ---
  
  const renderStepContent = () => {
    if (isCommercial(formData.cleaningType)) {
        // Commercial Flow
        // Steps: 1, 2, 3(Config), 4(Contact), 5(Result)
        switch(step) {
            case 1: return renderStep1_Basics();
            case 2: return renderStep2_CleaningType();
            case 3: return renderStep_CommercialConfig();
            case 4: return renderStep_Contact();
            case 5: return renderStep8_Result();
            default: return renderStep1_Basics();
        }
    } else if (isEndOfTenancy(formData.cleaningType)) {
        // End of Tenancy Flow
        // Steps: 1, 2, 3(Config), 4(Contact), 5(Result)
        switch(step) {
            case 1: return renderStep1_Basics();
            case 2: return renderStep2_CleaningType();
            case 3: return renderStep_EoTConfig();
            case 4: return renderStep_Contact();
            case 5: return renderStep8_Result();
            default: return renderStep1_Basics();
        }
    } else if (isDeepClean(formData.cleaningType)) {
        // Deep Clean Flow
        // Steps: 1, 2, 3(Config), 4(Contact), 5(Result)
        switch(step) {
            case 1: return renderStep1_Basics();
            case 2: return renderStep2_CleaningType();
            case 3: return renderStep_DeepConfig();
            case 4: return renderStep_Contact();
            case 5: return renderStep8_Result();
            default: return renderStep1_Basics();
        }
    } else if (isRegular(formData.cleaningType)) {
        // Regular Flow
        // Steps: 1, 2, 3(Config), 4(Contact), 5(Result)
        switch(step) {
            case 1: return renderStep1_Basics();
            case 2: return renderStep2_CleaningType();
            case 3: return renderStep_RegularConfig();
            case 4: return renderStep_Contact();
            case 5: return renderStep8_Result();
            default: return renderStep1_Basics();
        }
    } else if (isMoveInMoveOut(formData.cleaningType)) {
        // Move-In/Out Flow
        // Steps: 1, 2, 3(Config), 4(Contact), 5(Result)
        switch(step) {
            case 1: return renderStep1_Basics();
            case 2: return renderStep2_CleaningType();
            case 3: return renderStep_MoveInConfig(); 
            case 4: return renderStep_Contact(); 
            case 5: return renderStep8_Result();
            default: return renderStep1_Basics();
        }
    } else {
        // Standard Flow
        // Steps: 1, 2, 3, 4, 5, 6, 7(Contact), 8(Result)
        switch(step) {
            case 1: return renderStep1_Basics();
            case 2: return renderStep2_CleaningType();
            case 3: return renderStep3_Rooms();
            case 4: return renderStep4_Extras();
            case 5: return renderStep5_Condition();
            case 6: return renderStep6_Furniture();
            case 7: return renderStep_Contact();
            case 8: return renderStep8_Result();
            default: return renderStep1_Basics();
        }
    }
  };

  // --- Main Layout ---

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
             <Calculator className="w-4 h-4" /> AI Estimator
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">
            Estimate your price with <span className="text-brand-600">AI</span>
          </h1>
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-brand-100 overflow-hidden relative min-h-[500px] flex flex-col">
           
           {/* Progress Bar */}
           <div className="bg-slate-100 h-2 w-full">
               <div 
                 className="bg-brand-500 h-full transition-all duration-500 ease-out" 
                 style={{ width: `${(step / totalSteps) * 100}%` }}
               ></div>
           </div>

           {/* Step Content */}
           <div className="flex-grow p-6 md:p-10">
               {renderStepContent()}
           </div>

           {/* Footer Navigation */}
           {step < totalSteps && (
             <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button 
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${step === 1 ? 'opacity-0 cursor-default' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                
                <div className="text-sm font-medium text-slate-400">
                   Step {step} of {totalSteps}
                </div>

                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-md hover:bg-brand-700 hover:-translate-y-0.5 transition-all"
                >
                  {step === contactStepIndex ? 'Calculate Price' : 'Next'} <ChevronRight className="w-5 h-5" />
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};