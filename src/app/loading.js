export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-core via-[#009EC4] to-[#00D1B2] relative overflow-hidden">
        {/* Efek bubble di background */}
        <div className="absolute inset-0">
          <div className="absolute h-32 w-32 rounded-full bg-white/10 -top-16 -left-16 animate-float"></div>
          <div className="absolute h-24 w-24 rounded-full bg-white/10 top-1/2 -right-12 animate-float-delayed"></div>
          <div className="absolute h-16 w-16 rounded-full bg-white/10 -bottom-8 left-1/2 animate-float-slow"></div>
        </div>
  
        {/* Loading content */}
        <div className="text-center relative z-10">
          <div className="flex justify-center items-center mb-6">
            {/* Logo atau ikon perusahaan jika ada */}
            <div className="relative size-24">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
  
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
  
              {/* Inner content */}
              <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="size-8 rounded-full bg-white animate-pulse"></div>
              </div>
            </div>
          </div>
  
          {/* Text content */}
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white animate-pulse">
              Loading...
            </p>
            <p className="text-sm text-white/80">
              Mempersiapkan pengalaman terbaik untuk Anda
            </p>
          </div>
        </div>
      </div>
    );
  }
  