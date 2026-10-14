import { WorkspaceDemoClient } from "./WorkspaceDemoClient";
export function InteractiveWorkspaceDemo() {
  return (
    <section
      id="interactive-demo"
      className="py-12 sm:py-16 md:py-24 bg-[#F8FAFC] border-y border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-dark-200 tracking-tight font-poppins">
            Explore the Cloudence workspace.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-light-100 max-w-2xl mx-auto">
            Try this interactive demo: browse file categories, search sample
            files, and simulate uploads and sharing.
          </p>
        </div>
        <WorkspaceDemoClient />
      </div>
    </section>
  );
}
