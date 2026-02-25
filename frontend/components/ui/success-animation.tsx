import { motion } from 'framer-motion';
export default function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center"
    >
      <div className="relative">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl scale-[2]"
          style={{
            background: 'radial-gradient(circle, hsl(225 70% 50% / 0.15), transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        {/* Inner soft glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-md scale-125"
          style={{ background: 'hsl(225 70% 50% / 0.08)' }}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 1, 0.6], scale: [1, 1.4, 1.25] }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        />
        <svg width="100" height="100" viewBox="0 0 52 52" className="relative">
          {/* Background circle fill */}
          <motion.circle
            cx="26"
            cy="26"
            r="25"
            fill="hsl(225 70% 50% / 0.06)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />
          {/* Circle stroke */}
          <motion.circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="hsl(225 70% 50%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="157"
            strokeDashoffset="157"
            initial={{ strokeDashoffset: 157 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />
          {/* Checkmark */}
          <motion.path
            fill="none"
            stroke="hsl(225 70% 50%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 27l7 7 15-15"
            strokeDasharray="40"
            strokeDashoffset="40"
            initial={{ strokeDashoffset: 40 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
