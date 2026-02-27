import HeroSection from "@/components/home/HeroSection";
import ToolGrid from "@/components/home/ToolGrid";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <ToolGrid />

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <h2 className="text-4xl font-extrabold mb-6">Ready to transform your documents?</h2>
                    <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of developers and content creators using ConvertHub to streamline their documentation workflow.
                    </p>
                    <Link href="/pricing">
                        <button className="px-10 py-4 bg-white text-primary rounded-full font-extrabold text-xl shadow-xl hover:scale-105 transition-transform active:scale-95">
                            Get Pro Version
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
