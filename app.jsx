import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ShieldAlert, 
  Eye, 
  FileText, 
  Users, 
  MessageSquare, 
  ChevronRight, 
  AlertTriangle,
  Info,
  ExternalLink,
  Lock,
  Search,
  Camera,
  MapPin,
  CheckCircle,
  Loader2
} from 'lucide-react';

// Firebase configuration provided by environment
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'shafter-transparency-hub';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  
  // State for Dynamic Content
  const [signatures, setSignatures] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [signing, setSigning] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Form States
  const [petitionName, setPetitionName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Mock Camera Locations for the Map
  const cameraLocations = [
    { id: 1, lat: 35.500, lng: -119.270, location: "Lerdo Hwy & Central Valley Hwy", status: "Active" },
    { id: 2, lat: 35.505, lng: -119.275, location: "7th Standard Rd & Shafter Ct", status: "Active" },
    { id: 3, lat: 35.495, lng: -119.265, location: "Mannel Park Entrance", status: "Active" },
    { id: 4, lat: 35.510, lng: -119.280, location: "Shafter Ave & Fresno Ave", status: "Active" },
    { id: 5, lat: 35.502, lng: -119.255, location: "Bakersfield St & E Lerdo Hwy", status: "Pending Installation" }
  ];

  // Effect: Handle Scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect: Auth Initialization (Rule 3)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Effect: Data Listeners (Rule 1 & 2)
  useEffect(() => {
    if (!user) return;

    // Listen for Petition Signatures
    const sigRef = collection(db, 'artifacts', appId, 'public', 'data', 'signatures');
    const unsubSigs = onSnapshot(sigRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSignatures(data);
    }, (error) => console.error("Signatures error:", error));

    // Listen for Public Feedback
    const fbRef = collection(db, 'artifacts', appId, 'public', 'data', 'feedback');
    const unsubFb = onSnapshot(fbRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedback(data);
    }, (error) => console.error("Feedback error:", error));

    return () => {
      unsubSigs();
      unsubFb();
    };
  }, [user]);

  // Handler: Sign Petition
  const handleSignPetition = async (e) => {
    e.preventDefault();
    if (!user || !petitionName.trim()) return;
    setSigning(true);
    try {
      const sigDoc = doc(db, 'artifacts', appId, 'public', 'data', 'signatures', user.uid);
      await setDoc(sigDoc, {
        name: petitionName,
        timestamp: serverTimestamp(),
        userId: user.uid
      });
      setPetitionName('');
    } catch (error) {
      console.error("Signing error:", error);
    } finally {
      setSigning(false);
    }
  };

  // Handler: Submit Feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!user || !feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      const fbCol = collection(db, 'artifacts', appId, 'public', 'data', 'feedback');
      await addDoc(fbCol, {
        text: feedbackText,
        timestamp: serverTimestamp(),
        userId: user.uid
      });
      setFeedbackText('');
    } catch (error) {
      console.error("Feedback submission error:", error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-blue-700 p-2 rounded-lg">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-900 uppercase">
                Shafter <span className="text-blue-600">Transparency</span> Hub
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Community Watchdog & Accountability</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <NavItem id="home" label="Overview" icon={Eye} />
            <NavItem id="investigations" label="Investigations" icon={Search} />
            <NavItem id="surveillance" label="Surveillance" icon={Camera} />
            <NavItem id="get-involved" label="Action" icon={Users} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full mb-6 text-blue-200 text-sm">
              <AlertTriangle size={14} />
              <span>Demanding accountability in local governance</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Our City. <br />Our Money. <br />Our Right to Know.
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Shafter residents deserve a local government that operates in the light. We are tracking investigation costs, surveillance implementation, and closed-door decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('get-involved')}
                className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-xl flex items-center"
              >
                Sign the Petition ({signatures.length}) <ChevronRight className="ml-2" size={20} />
              </button>
              <div className="text-sm self-center text-blue-200 font-mono">
                {user ? `Session: ${user.uid.substring(0, 8)}...` : 'Connecting...'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="bg-red-100 text-red-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Lock size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Investigation Secrecy</h3>
                <p className="text-slate-600 mb-6">Taxpayer funds are being used to investigate council members without public disclosure of findings.</p>
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-red-500 mb-4">
                  <p className="text-sm font-semibold text-slate-700">Estimated Cost to Date:</p>
                  <p className="text-2xl font-black text-red-600">$100,000+</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Camera size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Surveillance Expansion</h3>
                <p className="text-slate-600 mb-6">Flock cameras are being installed despite widespread community opposition. Track them here.</p>
                <button onClick={() => setActiveTab('surveillance')} className="bg-amber-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-amber-700 transition-colors">
                  View Live Map
                </button>
              </div>
            </div>

            {/* Community Feedback Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2 text-blue-600" /> Community Feedback
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    <textarea 
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="What are your concerns about city governance?"
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                    />
                    <button 
                      disabled={submittingFeedback || !user}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center"
                    >
                      {submittingFeedback ? <Loader2 className="animate-spin mr-2" /> : "Submit Feedback"}
                    </button>
                  </form>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {feedback.length === 0 ? (
                    <p className="text-slate-400 italic">No feedback submitted yet. Be the first.</p>
                  ) : (
                    feedback.sort((a,b) => b.timestamp?.seconds - a.timestamp?.seconds).map(fb => (
                      <div key={fb.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-700 mb-2">{fb.text}</p>
                        <div className="text-[10px] text-slate-400 font-mono">USER: {fb.userId.substring(0, 12)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'surveillance' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-4xl font-bold mb-4">Surveillance Watch Map</h2>
            <p className="text-xl text-slate-600 mb-8">Locating the network of Flock Safety license plate readers across Shafter.</p>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-200 rounded-2xl overflow-hidden h-[600px] relative border-4 border-white shadow-xl">
                {/* Visual Map Representation */}
                <div className="absolute inset-0 bg-slate-300 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {cameraLocations.map(cam => (
                  <button
                    key={cam.id}
                    onClick={() => setSelectedCamera(cam)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-10 p-2 rounded-full shadow-lg ${
                      selectedCamera?.id === cam.id ? 'bg-red-600 text-white scale-110' : 'bg-white text-blue-600'
                    }`}
                    style={{ 
                      left: `${((cam.lng + 119.3) * 1000) % 100}%`, 
                      top: `${((cam.lat - 35.48) * 1000) % 100}%` 
                    }}
                  >
                    <MapPin size={24} />
                  </button>
                ))}

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 max-w-xs z-20">
                  <h4 className="font-bold text-sm mb-2">Map Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center"><MapPin size={12} className="text-blue-600 mr-2" /> Verified Camera</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-600 mr-2" /> Currently Selected</div>
                  </div>
                </div>

                {!selectedCamera && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-white font-bold text-slate-700 animate-bounce">
                      Select a pin to view details
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {selectedCamera ? (
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <Camera className="text-blue-600" size={32} />
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{selectedCamera.status}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Camera Details</h3>
                    <p className="text-slate-500 text-sm font-mono mb-6">ID: FLK-SHA-{selectedCamera.id}092</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Primary Location</p>
                        <p className="text-slate-700 font-medium">{selectedCamera.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Coordinates</p>
                        <p className="text-slate-700 font-mono text-sm">{selectedCamera.lat}, {selectedCamera.lng}</p>
                      </div>
                      <div className="pt-6 border-t border-slate-100">
                        <button className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Report Inaccuracy</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center text-blue-900 h-full flex flex-col justify-center">
                    <Info size={48} className="mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold mb-2">No Camera Selected</h3>
                    <p className="opacity-70">Interactive map allows you to see exactly where the city has deployed surveillance technology.</p>
                  </div>
                )}
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h4 className="text-red-800 font-bold mb-2 flex items-center">
                    <AlertTriangle size={18} className="mr-2" /> Privacy Impact
                  </h4>
                  <p className="text-sm text-red-700">These locations cover every major artery entering or leaving the residential core.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'get-involved' && (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
            <h2 className="text-4xl font-bold mb-4 text-center">Take Immediate Action</h2>
            <p className="text-xl text-slate-600 mb-12 text-center">Join {signatures.length} residents demanding transparency and surveillance oversight.</p>
            
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
              <div className="md:flex">
                <div className="md:w-1/2 p-12 bg-blue-900 text-white">
                  <h3 className="text-2xl font-bold mb-6">The Shafter Transparency Pledge</h3>
                  <div className="space-y-4 opacity-90 text-sm">
                    <p>By signing this petition, you are calling for:</p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Full release of the internal investigation report.</li>
                      <li>A 90-day moratorium on new surveillance cameras.</li>
                      <li>A public forum dedicated to budget transparency.</li>
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2 p-12">
                  {signatures.find(s => s.userId === user?.uid) ? (
                    <div className="text-center py-8">
                      <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Already Signed!</h3>
                      <p className="text-slate-500 mb-6">Thank you for your support. Please share this page with your neighbors.</p>
                      <button className="text-blue-600 font-bold hover:underline">Copy Referral Link</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSignPetition} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={petitionName}
                          onChange={(e) => setPetitionName(e.target.value)}
                          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <button 
                        disabled={signing || !user}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center"
                      >
                        {signing ? <Loader2 className="animate-spin mr-2" /> : "Sign the Petition"}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">Only your name will be visible to the community organizers</p>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold mb-4">Recent Signatories</h3>
                <div className="space-y-3">
                  {signatures.slice(0, 5).map(sig => (
                    <div key={sig.id} className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-lg">
                      <span className="font-semibold text-slate-700">{sig.name}</span>
                      <span className="text-slate-400 text-xs">{sig.timestamp ? new Date(sig.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 text-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Mailing List</h3>
                <p className="text-blue-200 text-sm mb-6">Receive alerts for emergency council meetings and records drops.</p>
                <div className="flex gap-2">
                  <input className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex-grow outline-none focus:ring-1 focus:ring-blue-500" placeholder="Email" />
                  <button className="bg-blue-600 px-4 py-2 rounded-lg font-bold">Join</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investigations' && (
           <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-bold mb-4">The "Closed Door" Investigations</h2>
            <p className="text-xl text-slate-600 mb-8">A timeline of public spending on internal council conflicts.</p>
            
            <div className="space-y-8 relative before:absolute before:left-[17px] before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200">
              {[
                { date: "Feb 2026", title: "Investigation Authorized", desc: "Council votes to hire external legal firm to investigate potential ethics violations of a sitting member. Initial budget: $25,000." },
                { date: "Mar 2026", title: "Budget Extension", desc: "Council quietly approves additional $40,000 for 'expanded scope' during a routine budget amendment." },
                { date: "April 2026", title: "Final Report Delivered", desc: "The investigation report is delivered to the council in closed session. A motion to release the summary is voted down 3-2." }
              ].map((item, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-0 top-1.5 w-9 h-9 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center z-10 text-blue-700">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-sm font-bold text-blue-600">{item.date}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Take Action: Public Records Requests</h3>
              <p className="mb-6 opacity-90">Every citizen has the right to file a California Public Records Act (CPRA) request. We've prepared a template for you to use to ask for invoice summaries and non-privileged data.</p>
              <button className="bg-white text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center">
                <FileText className="mr-2" size={20} /> Download CPRA Template
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-700 font-bold mb-2">
            <ShieldAlert size={18} className="text-blue-600" />
            <span>Shafter Transparency Hub</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Demanding accountability through community data collection.</p>
          <div className="text-[10px] text-slate-400 font-mono">APP_ID: {appId}</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
