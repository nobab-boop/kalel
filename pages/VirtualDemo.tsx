import React, { useState, useRef } from 'react';
import { Upload, Wand2, Loader2, Image as ImageIcon, Download, AlertCircle, RefreshCw, X, Sparkles } from 'lucide-react';
import { generateCleanImage } from '../services/geminiService';
import { Link } from 'react-router-dom';

export const VirtualDemo: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Professional deep clean. Remove all dirt, grime, algae, and stains from floors, walls, machines, and exterior surfaces. Organize any unorganized items. Make the area look spotless, tidy, and brand new while maintaining the original structure.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size too large. Please upload an image under 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError('');
    
    try {
      const result = await generateCleanImage(selectedImage, prompt);
      if (result) {
        setResultImage(result);
      } else {
        setError('Could not generate an image. Please try again or adjust your prompt.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the AI service. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResultImage(null);
    setError('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
             <Wand2 className="w-4 h-4" /> AI Powered Beta
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Softwash Preview</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a photo of your uncleaned roof, siding, or driveway and let our AI show you the potential transformation instantly.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-100">
           <div className="p-6 md:p-8 bg-brand-900 text-white">
               <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                   <div>
                       <h2 className="text-xl font-bold flex items-center gap-2">
                           <ImageIcon className="w-5 h-5 text-brand-400" />
                           Upload & Clean
                       </h2>
                       <p className="text-brand-200 text-sm mt-1">Accepts JPG, PNG (Max 5MB)</p>
                   </div>
                   {selectedImage && (
                       <button 
                         onClick={reset}
                         className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
                       >
                           <RefreshCw className="w-4 h-4" /> Start Over
                       </button>
                   )}
               </div>
           </div>

           <div className="p-6 md:p-10">
               {!selectedImage ? (
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="border-3 border-dashed border-brand-100 rounded-3xl bg-brand-50/50 hover:bg-brand-50 hover:border-brand-300 transition-all cursor-pointer h-80 flex flex-col items-center justify-center gap-4 group"
                   >
                       <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                           <Upload className="w-8 h-8 text-brand-500" />
                       </div>
                       <div className="text-center">
                           <p className="text-xl font-bold text-slate-700">Click to Upload Photo</p>
                           <p className="text-slate-400 text-sm mt-1">or drag and drop here</p>
                       </div>
                       <input 
                         ref={fileInputRef}
                         type="file" 
                         accept="image/*"
                         onChange={handleImageUpload}
                         className="hidden"
                       />
                   </div>
               ) : (
                   <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Original Image */}
                           <div className="space-y-3">
                               <div className="flex items-center justify-between">
                                   <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">Original Photo</span>
                                   <button onClick={reset} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                               </div>
                               <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                                   <img src={selectedImage} alt="Original" className="w-full h-full object-cover" />
                               </div>
                           </div>

                           {/* Result Image */}
                           <div className="space-y-3">
                               <span className="font-bold text-brand-600 text-sm uppercase tracking-wide flex items-center gap-2">
                                   <Wand2 className="w-4 h-4" /> 
                                   AI Result
                               </span>
                               <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
                                   {loading ? (
                                       <div className="text-center p-6">
                                           <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-3" />
                                           <p className="font-semibold text-slate-700">Softwashing in progress...</p>
                                           <p className="text-slate-500 text-xs mt-1">This may take up to 10-15 seconds</p>
                                       </div>
                                   ) : resultImage ? (
                                       <img src={resultImage} alt="Cleaned" className="w-full h-full object-cover" />
                                   ) : (
                                       <div className="text-slate-400 text-center p-8">
                                           <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                           <p>Click "Clean My Property" to generate result</p>
                                       </div>
                                   )}
                               </div>
                           </div>
                       </div>

                       {/* Controls */}
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                           <div className="mb-4">
                               <div className="flex justify-between items-end mb-2">
                                   <label className="block text-sm font-bold text-slate-700">Instructions for AI Cleaner</label>
                                   <button 
                                      onClick={() => setPrompt("Professional deep clean. Remove all dirt, grime, algae, and stains from floors, walls, machines, and exterior surfaces. Organize any unorganized items. Make the area look spotless, tidy, and brand new while maintaining the original structure.")}
                                      className="text-xs text-brand-600 font-bold flex items-center gap-1 hover:text-brand-700"
                                   >
                                       <Sparkles className="w-3 h-3" /> Use Smart Deep Clean
                                   </button>
                               </div>
                               <div className="relative">
                                   <input 
                                     type="text" 
                                     value={prompt}
                                     onChange={(e) => setPrompt(e.target.value)}
                                     className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                                     placeholder="Describe how you want to clean the image..."
                                   />
                                   <Wand2 className="absolute right-4 top-3.5 w-5 h-5 text-brand-400" />
                               </div>
                               <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                   <button 
                                      onClick={() => setPrompt("Remove algae from the roof tiles")}
                                      className="whitespace-nowrap px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-brand-300 hover:text-brand-600 transition"
                                   >
                                       Remove roof algae
                                   </button>
                                   <button 
                                      onClick={() => setPrompt("Clean the driveway concrete, remove oil stains")}
                                      className="whitespace-nowrap px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-brand-300 hover:text-brand-600 transition"
                                   >
                                       Clean driveway
                                   </button>
                                   <button 
                                      onClick={() => setPrompt("Remove all dirt and grime from the walls")}
                                      className="whitespace-nowrap px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-brand-300 hover:text-brand-600 transition"
                                   >
                                       Clean walls
                                   </button>
                                    <button 
                                      onClick={() => setPrompt("Organize unorganized items and clean everything")}
                                      className="whitespace-nowrap px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-brand-300 hover:text-brand-600 transition"
                                   >
                                       Organize & Clean
                                   </button>
                               </div>
                           </div>
                           
                           {error && (
                               <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                   <AlertCircle className="w-4 h-4 shrink-0" />
                                   {error}
                               </div>
                           )}

                           <div className="flex flex-col sm:flex-row gap-3 justify-end">
                               {resultImage && (
                                   <a 
                                     href={resultImage} 
                                     download="kl-softwash-preview.png"
                                     className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition"
                                   >
                                       <Download className="w-4 h-4" /> Save Photo
                                   </a>
                               )}
                               <button
                                 onClick={handleGenerate}
                                 disabled={loading}
                                 className={`flex items-center justify-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-700'}`}
                               >
                                   {loading ? 'Cleaning...' : 'Clean My Property'}
                                   {!loading && <Wand2 className="w-4 h-4" />}
                               </button>
                           </div>
                       </div>
                   </div>
               )}
           </div>
        </div>

        <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Love the result?</h3>
            <p className="text-slate-600 mb-6">Get the real thing. Book your appointment today!</p>
            <Link 
              to="/contact"
              className="inline-block bg-brand-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-brand-600 transition"
            >
                Get a Free Quote
            </Link>
        </div>
      </div>
    </div>
  );
};