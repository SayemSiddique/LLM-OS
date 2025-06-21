import {
  // System Icons
  Settings,
  Power,
  Search,
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  
  // UI Icons
  Menu,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  Edit,
  Trash,
  Download,
  Upload,
  Copy,
  Share,
  ExternalLink,
  
  // Status Icons
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader,
  RefreshCw,
  
  // Navigation Icons
  Home,
  Folder,
  File,
  FileText,
  Image,
  Video,
  Music,
  
  // Communication Icons
  MessageSquare,
  MessageCircle,
  Mail,
  Phone,
  
  // Device Icons
  Monitor,
  Smartphone,
  Tablet,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  
  // User Icons
  User,
  Users,
  UserPlus,
  UserMinus,
  
  // Time Icons
  Clock,
  Calendar,
  
  // Media Icons
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  
  // Code Icons
  Code,
  Code2,
  Terminal,
  Database,
  Server,
  
  // AI/LLM Icons
  Brain,
  Zap,
  Sparkles,
  Bot,
  
  // App Icons
  Calculator,
  Camera,
  Map,
  
  // Utility Icons
  Filter,
  ArrowUpDown,
  Grid3x3,
  List,
  Layout,
  
  type LucideIcon,
} from 'lucide-react';

// Custom LLM-OS specific icons
export const LLMOSIcons = {
  // System
  system: {
    settings: Settings,
    power: Power,
    search: Search,
    menu: Menu,
    home: Home,
  },
  
  // Actions
  actions: {
    add: Plus,
    close: X,
    confirm: Check,
    edit: Edit,
    delete: Trash,
    download: Download,
    upload: Upload,
    copy: Copy,
    share: Share,
    external: ExternalLink,
    more: MoreVertical,
    moreHorizontal: MoreHorizontal,
  },
  
  // Navigation
  navigation: {
    up: ChevronUp,
    down: ChevronDown,
    left: ChevronLeft,
    right: ChevronRight,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
  },
  
  // Status
  status: {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    loading: Loader,
    refresh: RefreshCw,
  },
  
  // Files
  files: {
    folder: Folder,
    file: File,
    text: FileText,
    image: Image,
    video: Video,
    audio: Music,
  },
  
  // Communication
  communication: {
    chat: MessageSquare,
    message: MessageCircle,
    mail: Mail,
    phone: Phone,
  },
    // Hardware
  hardware: {
    monitor: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
    cpu: Cpu,
    storage: HardDrive,
    memory: MemoryStick,
    wifi: Wifi,
    wifiOff: WifiOff,
    battery: Battery,
    batteryLow: BatteryLow,
  },
  
  // Users
  users: {
    user: User,
    users: Users,
    userAdd: UserPlus,
    userRemove: UserMinus,
  },
  
  // Time
  time: {
    clock: Clock,
    calendar: Calendar,
  },
    // Media
  media: {
    play: Play,
    pause: Pause,
    stop: Square,
    previous: SkipBack,
    next: SkipForward,
    volumeHigh: Volume2,
    volumeMid: Volume1,
    volumeLow: Volume,
    volumeOff: VolumeX,
  },
  
  // Development
  dev: {
    code: Code,
    code2: Code2,
    terminal: Terminal,
    database: Database,
    server: Server,
  },
    // AI/LLM
  ai: {
    brain: Brain,
    lightning: Zap,
    sparkles: Sparkles,
    bot: Bot,
  },
  
  // Apps
  apps: {
    calculator: Calculator,
    camera: Camera,
    map: Map,
  },
    // UI
  ui: {
    filter: Filter,
    sort: ArrowUpDown,
    grid: Grid3x3,
    list: List,
    layout: Layout,
    eye: Eye,
    eyeOff: EyeOff,
  },
};

// Icon component with consistent styling
interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';
  className?: string;
}

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const iconVariants = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-foreground-muted',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

export function Icon({ 
  icon: IconComponent, 
  size = 'md', 
  variant = 'default', 
  className = '',
  ...props 
}: IconProps & React.ComponentProps<LucideIcon>) {
  return (
    <IconComponent 
      className={`${iconSizes[size]} ${iconVariants[variant]} ${className}`}
      {...props}
    />
  );
}

// Animated icons
interface AnimatedIconProps extends IconProps {
  animation?: 'spin' | 'pulse' | 'bounce' | 'ping';
}

export function AnimatedIcon({ 
  animation, 
  className = '', 
  ...props 
}: AnimatedIconProps) {
  const animationClasses = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
  };

  const animationClass = animation ? animationClasses[animation] : '';
  
  return (
    <Icon 
      className={`${animationClass} ${className}`}
      {...props}
    />
  );
}

// Quick access to commonly used icons
export const SystemIcon = LLMOSIcons.system;
export const ActionIcon = LLMOSIcons.actions;
export const StatusIcon = LLMOSIcons.status;
export const AIIcon = LLMOSIcons.ai;
export const DevIcon = LLMOSIcons.dev;

export default LLMOSIcons;
