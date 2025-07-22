// 'use client'

// import { motion } from 'framer-motion'
// import { Github, Linkedin, Sparkles, Instagram } from 'lucide-react'

// export function Footer() {
//   const currentYear = new Date().getFullYear()

//   return (
//     <motion.footer 
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, delay: 0.4 }}
//       className="relative mt-20"
//     >
//       {/* Background gradient decoration */}
//       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"></div>
      
//       <div className="relative">
//         <div className="container mx-auto px-4 py-12">
//           <div className="relative group">
//             {/* Animated gradient border */}
//             <div className="absolute -inset-1 bg-gradient-border opacity-50 rounded-2xl blur-sm group-hover:opacity-75 transition duration-500 animate-gradient-x"></div>
            
//             <div className="relative bg-gradient-card/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-gradient">
//               <div className="text-center space-y-6">
//                 {/* Logo and tagline */}
//                 <div className="space-y-3">
//                   <div className="flex justify-center">
//                     <div className="relative">
//                       <div className="p-3 bg-gradient-primary rounded-xl shadow-gradient animate-float">
//                         <Sparkles className="w-6 h-6 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                   <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//                     ShortLink
//                   </h3>
//                   <p className="text-muted-foreground max-w-md mx-auto">
//                     Making the web more accessible, one short link at a time
//                   </p>
//                 </div>

//                 {/* Social Links */}
//                 <div className="flex justify-center space-x-4">
//                   {[
//                     { icon: Github, href: 'https://github.com', label: 'GitHub', gradient: 'bg-gradient-primary' },
//                     { icon: Instagram, href: 'https://instagram.com/kevinanp_', label: 'Instagram', gradient: 'bg-gradient-info' },
//                     { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', gradient: 'bg-gradient-accent' }
//                   ].map(({ icon: Icon, href, label, gradient }) => (
//                     <motion.a
//                       key={label}
//                       href={href}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className={`group relative p-3 ${gradient} rounded-lg text-white shadow-gradient hover:shadow-gradient-lg transition-all duration-300`}
//                     >
//                       <Icon className="w-5 h-5" />
//                     </motion.a>
//                   ))}
//                 </div>

//                 {/* Divider */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gradient-border opacity-30"></div>
//                   </div>
//                   <div className="relative flex justify-center">
//                     <div className="px-4 bg-gradient-card">
//                       <div className="p-2 bg-gradient-accent rounded-full">
//                         <Sparkles className="w-3 h-3 text-white animate-pulse" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Copyright */}
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">
//                     © {currentYear} Kevin Ananda Putra. All rights reserved.
//                   </p>
//                   <p className="text-xs text-muted-foreground/80">
//                     Built with Next.js 14, TypeScript, Tailwind CSS & Supabase
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.footer>
//   )
// }
