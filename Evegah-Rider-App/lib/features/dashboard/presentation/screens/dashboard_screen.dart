import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../../unlock/presentation/screens/scan_qr_screen.dart';
import 'vehicle_list_screen.dart';
import 'vehicle_details_screen.dart';
import '../../../auth/presentation/screens/login_screen.dart';
import '../../../../core/services/session_service.dart';
import '../widgets/bluetooth_scan_dialog.dart';
import '../../../../core/services/ble_battery_service.dart';
import 'select_location_screen.dart';
import 'dart:async';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _carouselIndex = 0;
  bool hasActiveRide = false; // Toggle true to view active ride mockup
  String selectedLocation = "Koramangala, Bengaluru";
  late PageController _pageController;
  Timer? _carouselTimer;

  final List<Map<String, dynamic>> _carouselSlides = [
    {
      "title": "Ride Electric.\nLive Better.",
      "subtitle": "Zero emissions. Maximum freedom.",
      "button": "Book EV in minutes",
      "image": "assets/v1.webp",
      "gradientStart": 0xFFEEF2FF,
      "gradientEnd": 0xFFE0E7FF,
    },
    {
      "title": "Daman & Aatapi\nSpecial Packages",
      "subtitle": "Rent for hours or days at discounted rates.",
      "button": "View Packages",
      "image": "assets/city.png",
      "gradientStart": 0xFFEBF3FF,
      "gradientEnd": 0xFFD6E4FF,
    },
    {
      "title": "Eco Friendly\nCommutes.",
      "subtitle": "Save the environment, save money.",
      "button": "Explore Models",
      "image": "assets/v2.webp",
      "gradientStart": 0xFFFDF2F8,
      "gradientEnd": 0xFFFCE7F3,
    },
  ];

  final List<Map<String, dynamic>> _evModels = [
    {
      "name": "Mink",
      "price": "₹29/hr",
      "image": "assets/v1.webp",
      "badge": "Best for Daily Commute",
      "badgeBg": 0xFFF5F3FF,
      "badgeText": 0xFF4313B8,
      "id": "MINK001",
    },
    {
      "name": "City",
      "price": "₹39/hr",
      "image": "assets/city.png",
      "badge": "Most Popular",
      "badgeBg": 0xFFECFDF5,
      "badgeText": 0xFF059669,
      "id": "CITY002",
    },
    {
      "name": "Fly",
      "price": "₹49/hr",
      "image": "assets/v2.webp",
      "badge": "Best for Long Rides",
      "badgeBg": 0xFFEFF6FF,
      "badgeText": 0xFF2563EB,
      "id": "FLY003",
    },
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _startCarouselTimer();

    // Trigger notification sheet after a short delay
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future.delayed(const Duration(milliseconds: 1500), () {
        if (mounted) {
          _showNotificationsPrompt();
        }
      });
    });
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startCarouselTimer() {
    _carouselTimer?.cancel();
    _carouselTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!mounted) return;
      int nextPage = _carouselIndex + 1;
      if (nextPage >= _carouselSlides.length) {
        nextPage = 0;
      }
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeInOut,
      );
    });
  }

  void _showNotificationsPrompt() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Top Header Block (Blue/Purple container)
              Stack(
                children: [
                  Container(
                    width: double.infinity,
                    height: 220,
                    decoration: const BoxDecoration(
                      color: Color(0xFF362FD9), // Match mockup background
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(24),
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(24),
                      ),
                      child: Center(
                        child: SvgPicture.asset(
                          "assets/Notification.svg",
                          fit: BoxFit.contain,
                          height: 200,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(
                                Icons.notifications_active_rounded,
                                size: 80,
                                color: Colors.white,
                              ),
                        ),
                      ),
                    ),
                  ),
                  // Close 'X' Button at top right
                  Positioned(
                    top: 16,
                    right: 16,
                    child: GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.close_rounded,
                          size: 20,
                          color: Colors.black54,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // Bottom White Info block
              Container(
                color: Colors.white,
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 30),
                child: Column(
                  children: [
                    const Text(
                      "Stay on track with\nreminders and alerts",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Get timely notifications for all your activities and stay on top of things",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey,
                        height: 1.45,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Allow Button (Purple themed)
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                "Notifications enabled successfully!",
                              ),
                              backgroundColor: Color(0xFF4313B8),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(
                            0xFF4313B8,
                          ), // Brand purple
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          elevation: 0,
                        ),
                        child: const Text(
                          "Allow notifications",
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // --- 1. TOP HEADER (Location & Bell - White Theme) ---
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 14, 20, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Location Selector
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => SelectLocationScreen(
                              currentCity: selectedLocation.split(",").first,
                              onLocationSelected: (city) {
                                setState(() {
                                  selectedLocation = "$city, India";
                                });
                              },
                            ),
                          ),
                        );
                      },
                      child: Row(
                        children: [
                          const Icon(
                            Icons.location_on_rounded,
                            color: Color(0xFF4313B8),
                            size: 20,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            selectedLocation,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: Colors.grey,
                            size: 18,
                          ),
                        ],
                      ),
                    ),
                    // Notification Bell Icon with Badge
                    Stack(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: const Icon(
                            Icons.notifications_none_rounded,
                            color: Colors.black,
                            size: 20,
                          ),
                        ),
                        Positioned(
                          top: 4,
                          right: 4,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.redAccent,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // --- 2. HERO CAROUSEL / ACTIVE RIDE ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: hasActiveRide
                    ? _buildActiveRideCard()
                    : _buildHeroCarousel(),
              ),
              const SizedBox(height: 20),

              // --- 3. STATUS CARDS (Live Battery & Wallet Balance Side by Side) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Live Battery status card
                    Expanded(
                      child: InkWell(
                        onTap: () async {
                          final loggedIn = await SessionService().isLoggedIn();
                          if (!mounted) return;
                          if (!loggedIn) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const LoginScreen(),
                              ),
                            );
                          } else {
                            showDialog(
                              context: context,
                              builder: (context) => const BluetoothScanDialog(),
                            );
                          }
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          height: 160,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.01),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ValueListenableBuilder<BleBatteryState>(
                            valueListenable:
                                BleBatteryService.instance.connectionState,
                            builder: (context, connState, _) {
                              final bool isConnected =
                                  connState == BleBatteryState.connected;
                              final IconData icon = isConnected
                                  ? Icons.bluetooth_connected_rounded
                                  : (connState == BleBatteryState.scanning ||
                                            connState ==
                                                BleBatteryState.connecting
                                        ? Icons.bluetooth_searching_rounded
                                        : Icons.bluetooth_disabled_rounded);
                              final Color iconColor = isConnected
                                  ? const Color(0xFF4313B8)
                                  : (connState == BleBatteryState.scanning ||
                                            connState ==
                                                BleBatteryState.connecting
                                        ? Colors.orange
                                        : Colors.grey);

                              final String statusText = isConnected
                                  ? "Connected"
                                  : (connState == BleBatteryState.scanning
                                        ? "Scanning..."
                                        : (connState ==
                                                  BleBatteryState.connecting
                                              ? "Connecting..."
                                              : "Disconnected"));

                              final Color dotColor = isConnected
                                  ? Colors.green
                                  : (connState == BleBatteryState.scanning ||
                                            connState ==
                                                BleBatteryState.connecting
                                        ? Colors.orange
                                        : Colors.red);

                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Icon(icon, color: iconColor, size: 16),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            const Text(
                                              "Live Battery",
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.black,
                                              ),
                                            ),
                                            Row(
                                              children: [
                                                Icon(
                                                  Icons.circle,
                                                  color: dotColor,
                                                  size: 4,
                                                ),
                                                const SizedBox(width: 3),
                                                Expanded(
                                                  child: Text(
                                                    statusText,
                                                    maxLines: 1,
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                    style: TextStyle(
                                                      fontSize: 8,
                                                      color: dotColor,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                  ValueListenableBuilder<double>(
                                    valueListenable: BleBatteryService
                                        .instance
                                        .batteryPercentage,
                                    builder: (context, percentage, _) {
                                      final double displayPct = isConnected
                                          ? percentage
                                          : 0.0;
                                      final String pctText = isConnected
                                          ? "${percentage.toStringAsFixed(0)}%"
                                          : "--%";
                                      final String rangeText = isConnected
                                          ? "Range ~ ${(percentage * 0.8).toStringAsFixed(0)} km"
                                          : "Range ~ -- km";

                                      return Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                pctText,
                                                style: const TextStyle(
                                                  fontSize: 26,
                                                  fontWeight: FontWeight.w900,
                                                  color: Color(0xFF4313B8),
                                                ),
                                              ),
                                              Text(
                                                rangeText,
                                                style: const TextStyle(
                                                  fontSize: 9,
                                                  color: Colors.grey,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ],
                                          ),
                                          SizedBox(
                                            width: 38,
                                            height: 38,
                                            child: Stack(
                                              alignment: Alignment.center,
                                              children: [
                                                CircularProgressIndicator(
                                                  value: displayPct / 100.0,
                                                  strokeWidth: 3.5,
                                                  backgroundColor:
                                                      Colors.grey.shade100,
                                                  valueColor:
                                                      const AlwaysStoppedAnimation<
                                                        Color
                                                      >(Color(0xFF4313B8)),
                                                ),
                                                const Icon(
                                                  Icons.bolt,
                                                  color: Color(0xFF4313B8),
                                                  size: 16,
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      );
                                    },
                                  ),
                                  const Divider(
                                    color: Color(0xFFF1F5F9),
                                    height: 1,
                                  ),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: const [
                                          Icon(
                                            Icons.favorite_rounded,
                                            color: Colors.redAccent,
                                            size: 12,
                                          ),
                                          SizedBox(width: 4),
                                          Text(
                                            "Battery Health",
                                            style: TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ],
                                      ),
                                      Row(
                                        children: [
                                          Text(
                                            isConnected ? "Good" : "--",
                                            style: TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                              color: isConnected
                                                  ? Colors.green
                                                  : Colors.grey,
                                            ),
                                          ),
                                          const Icon(
                                            Icons.keyboard_arrow_right_rounded,
                                            color: Colors.grey,
                                            size: 12,
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Wallet Balance Card
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        height: 160,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.01),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: BoxDecoration(
                                        color: const Color(
                                          0xFF4313B8,
                                        ).withValues(alpha: 0.1),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        Icons.account_balance_wallet_rounded,
                                        color: Color(0xFF4313B8),
                                        size: 12,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    const Text(
                                      "Wallet Balance",
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black,
                                      ),
                                    ),
                                  ],
                                ),
                                const Icon(
                                  Icons.keyboard_arrow_right_rounded,
                                  color: Colors.grey,
                                  size: 14,
                                ),
                              ],
                            ),
                            const Text(
                              "₹250",
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            Row(
                              children: [
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 5,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF5F3FF),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: const Color(0xFFDDD6FE),
                                      ),
                                    ),
                                    child: const Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.add,
                                          color: Color(0xFF4313B8),
                                          size: 10,
                                        ),
                                        SizedBox(width: 2),
                                        Text(
                                          "Add Money",
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF4313B8),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 5,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: const Color(0xFFE2E8F0),
                                      ),
                                    ),
                                    child: const Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.list_alt_rounded,
                                          color: Colors.grey,
                                          size: 10,
                                        ),
                                        SizedBox(width: 2),
                                        Text(
                                          "Transactions",
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.black87,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const Divider(color: Color(0xFFF1F5F9), height: 1),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: const [
                                    Icon(
                                      Icons.stars_rounded,
                                      color: Colors.amber,
                                      size: 13,
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      "Evegah Coins",
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: const [
                                    Text(
                                      "120",
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black,
                                      ),
                                    ),
                                    Icon(
                                      Icons.keyboard_arrow_right_rounded,
                                      color: Colors.grey,
                                      size: 12,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // --- 4. KYC BANNER CARD (Full Width Card) ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF), // Light purple theme card
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFDDD6FE)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Color(0xFF4313B8), // Brand purple avatar back
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.person_pin_rounded,
                          color: Colors.white,
                          size: 18,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              "Complete your KYC",
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              "To book rides and unlock all features",
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          // KYC action
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(
                            0xFF4313B8,
                          ), // Purple Button
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 8,
                          ),
                          minimumSize: Size.zero,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text(
                              "Complete KYC",
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 4),
                            Icon(
                              Icons.arrow_forward_rounded,
                              size: 10,
                              color: Colors.white,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // --- 5. SERVICES ROW ---
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                child: Row(
                  children: [
                    _buildServiceItem(
                      Icons.flash_on_rounded,
                      "100% Electric",
                      "Zero emissions",
                      Colors.blue,
                    ),
                    _buildServiceItem(
                      Icons.calendar_today_rounded,
                      "Easy Booking",
                      "Book in 2 taps",
                      Colors.purple,
                    ),
                    _buildServiceItem(
                      Icons.sell_rounded,
                      "Flexible Pricing",
                      "Mins or hours",
                      Colors.orange,
                    ),
                    _buildServiceItem(
                      Icons.security_rounded,
                      "Safe & Secure",
                      "Verified rides",
                      Colors.green,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // --- 6. OUR EVs SECTION ---
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "Our EVs",
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const VehicleListScreen(),
                          ),
                        );
                      },
                      child: const Text(
                        "View all",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF4313B8), // Brand purple link
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              SizedBox(
                height: 190,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  itemCount: _evModels.length,
                  itemBuilder: (context, index) {
                    final ev = _evModels[index];
                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                VehicleDetailsScreen(vehicleId: ev["id"]!),
                          ),
                        );
                      },
                      child: Container(
                        width: 140,
                        margin: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 4,
                        ),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.01),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Center(
                                child: Image.asset(
                                  ev["image"]!,
                                  fit: BoxFit.contain,
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              ev["name"]!,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  "From ${ev["price"]}",
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(3),
                                  decoration: const BoxDecoration(
                                    color: Color(0xFFF5F3FF),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.keyboard_arrow_right_rounded,
                                    color: Color(0xFF4313B8),
                                    size: 12,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: Color(ev["badgeBg"]!),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                ev["badge"]!,
                                style: TextStyle(
                                  fontSize: 8,
                                  fontWeight: FontWeight.bold,
                                  color: Color(ev["badgeText"]!),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // --- 7. ZONES CARD SECTION (Showrooms card below EVs list) ---
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  "1 Zone in your city",
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Zone Image with Floating Badge
                      Stack(
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(24),
                            ),
                            child: Image.network(
                              "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&fit=crop&q=80",
                              height: 160,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Container(
                                    height: 160,
                                    color: const Color(0xFFF1F5F9),
                                    child: const Icon(
                                      Icons.home_work_rounded,
                                      size: 50,
                                      color: Colors.grey,
                                    ),
                                  ),
                            ),
                          ),
                          Positioned(
                            left: 12,
                            bottom: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(30),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Colors.black12,
                                    blurRadius: 4,
                                  ),
                                ],
                              ),
                              child: const Text(
                                "100+ EVs", // "100+ cars" updated to "100+ EVs"
                                style: TextStyle(
                                  color: Color(0xFF0F172A),
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Zone Info
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "OP Road",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              "Akshar Chowk, Vadodara",
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Directions Row
                            Row(
                              children: const [
                                Text(
                                  "3.1 km from Sayaji Baug | ",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF4313B8),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  "Get directions",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF4313B8),
                                    fontWeight: FontWeight.bold,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                SizedBox(width: 4),
                                Icon(
                                  Icons.directions_rounded,
                                  color: Color(0xFF4313B8),
                                  size: 16,
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),

                            // Status row
                            Row(
                              children: const [
                                Text(
                                  "Closed",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.redAccent,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  " • Opens at 11:00 AM",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),

                            // Action Buttons
                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton.icon(
                                    onPressed: () {},
                                    icon: const Icon(
                                      Icons.call_rounded,
                                      size: 16,
                                    ),
                                    label: const Text(
                                      "Call us now",
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: const Color(0xFF4313B8),
                                      side: const BorderSide(
                                        color: Color(0xFF4313B8),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 12,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              const VehicleListScreen(),
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF4313B8),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 12,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      elevation: 0,
                                    ),
                                    child: const Text(
                                      "View Zone",
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildServiceItem(
    IconData icon,
    String title,
    String subtitle,
    Color color,
  ) {
    return Container(
      width: 100,
      margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 8,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // --- AUTO-CHANGING HERO CAROUSEL ---
  Widget _buildHeroCarousel() {
    return Column(
      children: [
        SizedBox(
          height: 170,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _carouselIndex = index;
              });
            },
            itemCount: _carouselSlides.length,
            itemBuilder: (context, index) {
              final slide = _carouselSlides[index];

              return _RunningVehicleSlide(
                key: ValueKey('slide_$index'),
                slide: slide,
                onButtonPressed: () async {
                  final loggedIn = await SessionService().isLoggedIn();
                  if (!context.mounted) return;
                  if (loggedIn) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ScanQrScreen(),
                      ),
                    );
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const LoginScreen(),
                      ),
                    );
                  }
                },
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        // Dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _carouselSlides.length,
            (idx) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: _carouselIndex == idx ? 16 : 6,
              height: 6,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                color: _carouselIndex == idx
                    ? const Color(0xFF4313B8)
                    : Colors.grey.shade300,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSlideTitle(String title) {
    if (title.contains("Electric")) {
      return const Text.rich(
        TextSpan(
          children: [
            TextSpan(
              text: "Ride ",
              style: TextStyle(color: Color(0xFF0F172A)),
            ),
            TextSpan(
              text: "Electric.\n",
              style: TextStyle(
                color: Color(0xFF4313B8),
                fontWeight: FontWeight.w900,
              ),
            ),
            TextSpan(
              text: "Live Better.",
              style: TextStyle(color: Color(0xFF0F172A)),
            ),
          ],
        ),
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          height: 1.2,
        ),
      );
    } else {
      return Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Color(0xFF0F172A),
          height: 1.2,
        ),
      );
    }
  }

  // --- ACTIVE RIDE RENDERER ---
  Widget _buildActiveRideCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1E1452), Color(0xFF0F0933)],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E1452).withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.electric_bike, color: Colors.white, size: 28),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  "Ride in Progress",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Icon(Icons.circle, color: Colors.greenAccent, size: 8),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActiveRideStat("14:02", "Duration"),
              ValueListenableBuilder<BleBatteryState>(
                valueListenable: BleBatteryService.instance.connectionState,
                builder: (context, connState, _) {
                  if (connState == BleBatteryState.connected) {
                    return ValueListenableBuilder<double>(
                      valueListenable:
                          BleBatteryService.instance.batteryPercentage,
                      builder: (context, percentage, _) {
                        return _buildActiveRideStat(
                          "${percentage.toStringAsFixed(0)}%",
                          "Battery",
                        );
                      },
                    );
                  }
                  return _buildActiveRideStat("--%", "Battery");
                },
              ),
              _buildActiveRideStat("2.4km", "Distance"),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 40,
            child: ElevatedButton(
              onPressed: () {
                // Navigate to active ride
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withValues(alpha: 0.15),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                "View Live Ride",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveRideStat(String val, String lbl) {
    return Column(
      children: [
        Text(
          val,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(lbl, style: const TextStyle(color: Colors.white70, fontSize: 10)),
      ],
    );
  }
}

// --- CUSTOM STATEFUL WIDGET FOR RUNNING EV SCOOTER ANIMATION (Slide 1) ---
class _RunningVehicleSlide extends StatefulWidget {
  final Map<String, dynamic> slide;
  final VoidCallback onButtonPressed;

  const _RunningVehicleSlide({
    super.key,
    required this.slide,
    required this.onButtonPressed,
  });

  @override
  State<_RunningVehicleSlide> createState() => _RunningVehicleSlideState();
}

class _RunningVehicleSlideState extends State<_RunningVehicleSlide>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _scooterTranslation;
  late Animation<double> _vibration;
  late Animation<double> _contentOpacity;
  late Animation<Offset> _contentSlide;
  late Animation<double> _badgeScale;
  late Animation<double> _badgeRotate;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    );

    // Translate the vehicle from left to right (begin offset -1.5)
    _scooterTranslation =
        Tween<Offset>(begin: const Offset(-1.5, 0.0), end: Offset.zero).animate(
          CurvedAnimation(
            parent: _controller,
            curve: const Interval(0.0, 0.65, curve: Curves.easeOutCubic),
          ),
        );

    // Subtle vibration shake sequence while running
    _vibration = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 0.0, end: -3.0), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: -3.0, end: 3.0), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: 3.0, end: -2.0), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: -2.0, end: 2.0), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: 2.0, end: -1.0), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: -1.0, end: 1.0), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: -0.5), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: -0.5, end: 0.5), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: 0.5, end: -0.2), weight: 10),
      TweenSequenceItem(tween: Tween<double>(begin: -0.2, end: 0.0), weight: 10),
    ]).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.7, curve: Curves.linear),
      ),
    );

    // Reveal text in sync with vehicle running
    _contentOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.65, curve: Curves.easeIn),
      ),
    );
    _contentSlide = Tween<Offset>(begin: const Offset(-0.25, 0.0), end: Offset.zero).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.65, curve: Curves.easeOutCubic),
      ),
    );

    // Scale up the offer badge after the vehicle stops
    _badgeScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.65, 0.85, curve: Curves.elasticOut),
      ),
    );

    // Wiggle/rotate the offer badge slightly
    _badgeRotate = Tween<double>(begin: 0.0, end: 0.04).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.65, 1.0, curve: Curves.elasticOut),
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final slide = widget.slide;
    final startColor = Color(slide["gradientStart"]!);
    final endColor = Color(slide["gradientEnd"]!);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [startColor, endColor],
        ),
      ),
      child: Row(
        children: [
          // Left Info column (reveals in sync)
          Expanded(
            flex: 4,
            child: FadeTransition(
              opacity: _contentOpacity,
              child: SlideTransition(
                position: _contentSlide,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSlideTitle(slide["title"]!),
                        const SizedBox(height: 6),
                        Text(
                          slide["subtitle"]!,
                          style: const TextStyle(
                            color: Color(0xFF475569),
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      onPressed: widget.onButtonPressed,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4313B8), // Brand purple
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 8,
                        ),
                        minimumSize: Size.zero,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            slide["button"]!,
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.arrow_forward_rounded,
                            size: 10,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Right animated scooter column
          Expanded(
            flex: 3,
            child: Stack(
              alignment: Alignment.center,
              clipBehavior: Clip.none,
              children: [
                // Running vehicle with driving + vibration translation
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    final offset = _scooterTranslation.value;
                    final dy = _vibration.value;
                    return FractionalTranslation(
                      translation: offset,
                      child: Transform.translate(
                        offset: Offset(0, dy),
                        child: child,
                      ),
                    );
                  },
                  child: Image.asset(
                    slide["image"]!,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) => const Icon(
                      Icons.electric_scooter_rounded,
                      size: 45,
                      color: Color(0xFF4313B8),
                    ),
                  ),
                ),
                // Revealed Offer Badge
                Positioned(
                  top: -12,
                  right: -10,
                  child: ScaleTransition(
                    scale: _badgeScale,
                    child: RotationTransition(
                      turns: _badgeRotate,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFD2FC00), // Lime Green
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.12),
                              blurRadius: 6,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text(
                              "30% OFF",
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            Text(
                              "First Ride!",
                              style: TextStyle(
                                color: Colors.black87,
                                fontSize: 5.5,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSlideTitle(String title) {
    if (title.contains("Electric")) {
      return const Text.rich(
        TextSpan(
          children: [
            TextSpan(
              text: "Ride ",
              style: TextStyle(color: Color(0xFF0F172A)),
            ),
            TextSpan(
              text: "Electric.\n",
              style: TextStyle(
                color: Color(0xFF4313B8),
                fontWeight: FontWeight.w900,
              ),
            ),
            TextSpan(
              text: "Live Better.",
              style: TextStyle(color: Color(0xFF0F172A)),
            ),
          ],
        ),
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          height: 1.2,
        ),
      );
    } else {
      return Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Color(0xFF0F172A),
          height: 1.2,
        ),
      );
    }
  }
}
