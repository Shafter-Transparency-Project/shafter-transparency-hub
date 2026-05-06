import React, { useState, useEffect } from 'react';
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
  Camera
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Content Data
  const updates = [
    {
      id: 1,
      title: "Closed Session Investigation Findings Still Withheld",
      date: "May 1, 2026",
      category: "Investigations",
      summary: "Despite taxpayer funding exceeding $100k for internal investigations, the City Council has yet to release the final report to the public."
    },
    {
      id: 2,
      title: "Flock Camera Expansion Map Updated",
      date: "April 28, 2026",
      category: "Surveillance",
      summary: "New locations identified for automated license plate readers. Community privacy concerns remain unaddressed by council leadership."
    },
    {
      id: 3,
      title: "Upcoming Budget Hearing: Allocation of Legal Fees",
      date: "May 15, 2026",
      category: "Meetings",
      summary: "Analysis of how much of the city's general fund is being diverted to 'Administrative Investigations'."
    }
  ];

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
              <h1 className="text-xl font-bold tracking-tight text-blue-900">SHAFTER <span className="text-blue-600">TRANSPARENCY</span> HUB</h1>
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
              Shafter residents deserve a local government that operates in the light. We are tracking investigation costs, surveillance implementation, and closed-door decisions that affect your privacy and wallet.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('investigations')}
                className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-xl flex items-center"
              >
                View Investigation Tracking <ChevronRight className="ml-2" size={20} />
              </button>
              <button 
                className="bg-blue-600/30 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600/50 transition-colors"
              >
                Join the Mailing List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Critical Alerts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="bg-red-100 text-red-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Lock size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Investigation Secrecy</h3>
                <p className="text-slate-600 mb-6">
                  The City Council is currently spending significant public funds to investigate its own members. Despite this being public money, the results are buried in "closed session" with no public disclosure of findings or merit.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-red-500 mb-4">
                  <p className="text-sm font-semibold text-slate-700">Estimated Cost to Date:</p>
                  <p className="text-2xl font-black text-red-600">$100,000+</p>
                </div>
                <button onClick={() => setActiveTab('investigations')} className="text-blue-600 font-bold flex items-center hover:underline">
                  Read full analysis <ChevronRight size={16} />
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Eye size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Flock Camera Overreach</h3>
                <p className="text-slate-600 mb-6">
                  Mass surveillance has arrived in Shafter without meaningful community consent. Despite vocal opposition at public hearings, the network of license plate readers continues to expand.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-amber-500 mb-4">
                  <p className="text-sm font-semibold text-slate-700">Constituency Sentiment:</p>
                  <p className="text-2xl font-black text-amber-600">Overwhelming Opposition</p>
                </div>
                <button onClick={() => setActiveTab('surveillance')} className="text-blue-600 font-bold flex items-center hover:underline">
                  View camera locations <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Latest Updates */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-3xl font-bold">Latest Updates</h3>
                  <p className="text-slate-500">Stay informed on recent developments</p>
                </div>
                <button className="text-blue-600 font-semibold hover:underline">View all news</button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {updates.map(update => (
                  <div key={update.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="p-6">
                      <div className="text-xs font-bold text-blue-600 uppercase mb-2">{update.category}</div>
                      <h4 className="text-lg font-bold mb-3 group-hover:text-blue-700 transition-colors leading-tight">{update.title}</h4>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{update.summary}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">{update.date}</span>
                        <button className="text-slate-400 hover:text-blue-600"><ExternalLink size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
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

        {activeTab === 'surveillance' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-4xl font-bold mb-4">Surveillance Watch</h2>
            <p className="text-xl text-slate-600 mb-8">Monitoring the deployment and policy of Flock Safety cameras in Shafter.</p>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-12">
              <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Camera size={18} className="text-slate-500" />
                  <span className="font-bold text-slate-700">Interactive Deployment Map (Conceptual)</span>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">24 Active Units</span>
              </div>
              <div className="h-96 bg-slate-200 flex items-center justify-center relative">
                <div className="text-center p-8">
                  <Info size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">In a production environment, this would display a map of known ALPR locations.</p>
                </div>
                {/* Floating "Markers" */}
                <div className="absolute top-1/4 left-1/3 bg-blue-600 w-4 h-4 rounded-full shadow-lg animate-pulse" />
                <div className="absolute top-1/2 left-2/3 bg-blue-600 w-4 h-4 rounded-full shadow-lg animate-pulse delay-75" />
                <div className="absolute bottom-1/3 left-1/4 bg-blue-600 w-4 h-4 rounded-full shadow-lg animate-pulse delay-150" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">The Privacy Concerns</h3>
                <ul className="space-y-3">
                  {[
                    "Retention of data on non-involved vehicles (90 days).",
                    "Sharing of local data with out-of-state agencies.",
                    "Lack of clear audit logs available for public oversight.",
                    "No citizen oversight committee for surveillance technology."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mt-1.5 mr-3 bg-red-100 text-red-600 p-0.5 rounded">
                        <AlertTriangle size={14} />
                      </div>
                      <span className="text-slate-700">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Council Vote History</h3>
                <p className="text-sm text-slate-600 mb-4">How your representatives voted on the latest Flock expansion:</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Member A</span>
                    <span className="text-green-600 font-bold uppercase text-xs">YEA</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Member B</span>
                    <span className="text-green-600 font-bold uppercase text-xs">YEA</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Member C</span>
                    <span className="text-red-600 font-bold uppercase text-xs">NAY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'get-involved' && (
          <div className="max-w-4xl mx-auto text-center animate-in zoom-in-95 duration-300">
            <h2 className="text-4xl font-bold mb-4">Reclaim Your Voice</h2>
            <p className="text-xl text-slate-600 mb-12">Transparency doesn't happen by accident. It happens through participation.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Speak at Meetings</h3>
                <p className="text-slate-600 text-sm mb-6">Every City Council meeting has a public comment section. We track the schedule and provide talking points.</p>
                <button className="w-full py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">Next Meeting Info</button>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="bg-green-100 text-green-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Petition</h3>
                <p className="text-slate-600 text-sm mb-6">Join 850+ other Shafter residents calling for an immediate pause on surveillance expansion until a public audit is held.</p>
                <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md">Sign Petition</button>
              </div>

              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="bg-purple-100 text-purple-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Record Sharing</h3>
                <p className="text-slate-600 text-sm mb-6">Obtained a public record through FOIA/CPRA? Share it with the Hub to help us piece together the full story.</p>
                <button className="w-full py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">Upload Records</button>
              </div>
            </div>

            <div className="mt-16 p-12 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Stay Connected</h3>
                <p className="text-blue-200 max-w-xl mx-auto mb-8 text-lg">Sign up for the "Transparency Alert" email. We only send updates when critical council votes or new investigation findings are discovered.</p>
                <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-white text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">Subscribe</button>
                </form>
              </div>
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 text-slate-700 font-bold mb-2">
                <ShieldAlert size={18} className="text-blue-600" />
                <span>Shafter Transparency Hub</span>
              </div>
              <p className="text-sm text-slate-500">A community-led project for government accountability.</p>
            </div>
            <div className="flex space-x-8 text-sm font-medium text-slate-600">
              <button className="hover:text-blue-600">Privacy Policy</button>
              <button className="hover:text-blue-600">Contact Team</button>
              <button className="hover:text-blue-600">Disclaimer</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Shafter Transparency Hub. This site is not affiliated with the City of Shafter government.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
