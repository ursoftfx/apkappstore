import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { AppDetails } from '../../types';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { incrementDownloadCount } from '../../lib/supabase';

interface AppCardProps {
  app: AppDetails;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await incrementDownloadCount(app.id);
      
      const link = document.createElement('a');
      link.href = app.file_url;
      link.download = `${app.title}-v${app.version}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <Link to={`/app/${app.id}`} className="app-card group">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={app.icon_url} 
          alt={`${app.title} app icon`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="badge-accent text-xs">
            v{app.version}
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{app.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{app.description}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{formatDate(app.created_at)}</span>
          <span className="text-xs font-medium text-primary-600">{formatFileSize(app.file_size)}</span>
        </div>
      </div>
      <div className="border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
        <button 
          onClick={handleDownload}
          className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
          aria-label={`Download ${app.title}`}
        >
          <Download className="h-4 w-4 mr-1" />
          <span>{app.download_count.toLocaleString()}</span>
        </button>
        <span className="badge-primary">{app.category}</span>
      </div>
      
      {/* Structured Data for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": app.title,
          "description": app.description,
          "applicationCategory": app.category,
          "operatingSystem": "Android",
          "version": app.version,
          "downloadUrl": app.file_url,
          "installUrl": app.file_url,
          "author": {
            "@type": "Person",
            "name": app.user?.full_name || "Unknown Developer"
          },
          "datePublished": app.created_at,
          "dateModified": app.updated_at,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "ratingCount": app.download_count
          }
        })}
      </script>
    </Link>
  );
};

export default AppCard;