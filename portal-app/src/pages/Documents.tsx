import React from 'react';
import { useDocuments } from '../hooks/useData';
import { FileText, Download, Lock, Calendar, Search } from 'lucide-react';

export const Documents: React.FC = () => {
  const { documents, loading } = useDocuments();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Client Vault</h1>
          <p className="text-muted-foreground mt-2 font-medium flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-green-600" />
            End-to-End Encrypted Storage
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-shadow shadow-sm"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
             <FileText className="w-32 h-32 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg relative z-10">Tax Documents</h3>
          <p className="text-blue-700/80 dark:text-blue-300 text-sm mt-1 relative z-10">2 documents available for 2023</p>
          <button className="mt-4 text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline relative z-10">View Tax Package</button>
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium">
          <h3 className="font-semibold text-foreground text-lg">Statements</h3>
          <p className="text-muted-foreground text-sm mt-1">Monthly & Quarterly updates</p>
          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-semibold text-muted-foreground z-10 relative">
                Q{i}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium">
          <h3 className="font-semibold text-foreground text-lg">Legal & Agreements</h3>
          <p className="text-muted-foreground text-sm mt-1">Account openings and IPS</p>
          <button className="mt-4 px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors w-full">Upload New</button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-premium">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground text-lg">Recent Documents</h3>
        </div>
        <div className="divide-y divide-border">
          {documents.map((doc: any) => (
            <div key={doc.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs font-medium px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-muted-foreground border border-border/50">{doc.type}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(doc.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline-block">• {doc.size}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 sm:px-4 sm:py-2 bg-card border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 shadow-sm">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline-block">Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
