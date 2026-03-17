export default function About() {
    return (
      <div className="w-full max-w-5xl mx-auto">
  
        {/* Hero Section */}
        <div className="py-20 px-6 border-b border-white/10">
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4">About This Project</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Where computer science<br />meets biology.
          </h2>
          <p className="text-gray-400 leading-relaxed text-base max-w-2xl">
            Built at the intersection of a lifelong passion for programming and a growing interest in
            clinical research — this project is a hands-on exploration of what software can reveal
            about cancer biology.
          </p>
        </div>
  
        {/* Inspiration Section */}
        <div className="py-20 px-6">
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4">The Story</p>
          <h3 className="text-3xl font-bold text-white mb-8">What inspired this</h3>
          <div className="space-y-5 text-gray-400 leading-relaxed max-w-3xl">
            <p>
              I knew early on in high school — after building several websites — that I had a genuine
              passion for programming and problem solving. After my first internship, I felt like I was
              growing fast, but still wanted more depth.
            </p>
            <p>
              In college, most of my friends were pursuing pre-med degrees. While that wasn't my path,
              it sparked a strong interest in biology and clinical research that I couldn't ignore. I
              wanted to find a way to bring both worlds together.
            </p>
            <p>
              After taking Object-Oriented Design and Data Science, I learned not only how to build
              more scalable programs, but also how to handle large datasets and APIs. This project
              became my way of pulling everything together — a knowledge checkpoint that let me
              practice what I'd learned while exploring something completely new, like React.
            </p>
          </div>
        </div>
  
      </div>
    );
  }