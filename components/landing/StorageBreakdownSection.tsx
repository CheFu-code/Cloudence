import { categories } from "@/constants";

export function StorageBreakdownSection() {
    return (
        <section id="storage" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Explanatory Copy */}
                    <div className="lg:col-span-5">

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-poppins mt-4">
                            Clear quotas. Zero guesswork.
                        </h2>
                        <p className="mt-4 text-base text-slate-600 leading-relaxed">
                            Most cloud drives obscure where your gigabytes are going with confusing nested directories. Cloudence categorizes your storage live so you always know where your capacity is allocated.
                        </p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                                <p className="text-sm text-slate-700">
                                    <strong className="font-semibold text-slate-900">50MB Single File Threshold:</strong> Designed for everyday productivity documents, presentations, and media clips.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                                <p className="text-sm text-slate-700">
                                    <strong className="font-semibold text-slate-900">CDN Edge Delivery:</strong> Files are delivered over high-speed content delivery networks for minimum latency.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                                <p className="text-sm text-slate-700">
                                    <strong className="font-semibold text-slate-900">Immediate Space Reclaim:</strong> Deleting files permanently cleans up and instantly credits back your quota.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual Category Breakdown Cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <div
                                    key={cat.name}
                                    className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                                            {cat.typicalSize}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900 font-poppins">
                                        {cat.name}
                                    </h3>

                                    <p className="text-xs text-slate-500 font-mono mt-1 mb-3">
                                        {cat.formats}
                                    </p>

                                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                                        {cat.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}