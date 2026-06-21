import 'package:flutter/material.dart';
import 'vehicle_details_screen.dart';
import 'main_navigation.dart';
import '../../../../core/services/session_service.dart';
import '../../../auth/presentation/screens/login_screen.dart';

class VehicleListScreen extends StatefulWidget {
  const VehicleListScreen({super.key});

  @override
  State<VehicleListScreen> createState() => _VehicleListScreenState();
}

class _VehicleListScreenState extends State<VehicleListScreen> {
  String _selectedCategory = "Scooter";
  final List<String> _categories = [
    "All",
    "Bikes",
    "Scooter",
    "Cargo Bikes",
    "Mountain",
  ];

  final List<Map<String, dynamic>> _allVehicles = [
    {
      "id": "MINK001",
      "name": "levegah 1S Electric Scooter",
      "category": "Scooter",
      "price": "\$16",
      "image": "assets/v1.webp",
      "isFavorite": false,
    },
    {
      "id": "CITY002",
      "name": "Vespa Elettrica",
      "category": "Scooter",
      "price": "\$45",
      "image": "assets/v2.webp",
      "isFavorite": true,
    },
    {
      "id": "VESPA003",
      "name": "evegah Mink",
      "category": "Scooter",
      "price": "\$29",
      "image": "assets/v1.webp",
      "isFavorite": false,
    },
    {
      "id": "PRO004",
      "name": "evegah Pro",
      "category": "Scooter",
      "price": "\$59",
      "image": "assets/v2.webp",
      "isFavorite": false,
    },
    {
      "id": "BIKE005",
      "name": "evegah City Bike",
      "category": "Bikes",
      "price": "\$39",
      "image": "assets/v1.webp",
      "isFavorite": false,
    },
    {
      "id": "CARGO006",
      "name": "Cargo Max",
      "category": "Cargo Bikes",
      "price": "\$49",
      "image": "assets/v2.webp",
      "isFavorite": false,
    },
  ];

  List<Map<String, dynamic>> get _filteredVehicles {
    if (_selectedCategory == "All") {
      return _allVehicles;
    }
    return _allVehicles
        .where((v) => v["category"] == _selectedCategory)
        .toList();
  }

  Future<void> _navigateToTab(int index) async {
    final loggedIn = await SessionService().isLoggedIn();
    if (!mounted) return;

    if (index > 0) {
      if (!loggedIn) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
        return;
      }
    }

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) => MainNavigation(initialIndex: index),
      ),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // --- TOP SEARCH & FILTER BAR ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 52,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.search, color: Colors.grey, size: 22),
                          SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              decoration: InputDecoration(
                                hintText: "Search for vehicles...",
                                hintStyle: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                                border: InputBorder.none,
                                isDense: true,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    height: 52,
                    width: 52,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: IconButton(
                      icon: const Icon(
                        Icons.tune,
                        color: Color(0xFF4313B8),
                        size: 22,
                      ),
                      onPressed: () {},
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // --- CATEGORIES HORIZONTAL BAR ---
            SizedBox(
              height: 42,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isSelected = cat == _selectedCategory;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 22),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFF4313B8)
                            : Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isSelected
                              ? Colors.transparent
                              : const Color(0xFFE2E8F0),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        cat,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: isSelected
                              ? Colors.white
                              : Colors.grey.shade600,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // --- VEHICLES GRID LIST ---
            Expanded(
              child: _filteredVehicles.isEmpty
                  ? const Center(
                      child: Text("No vehicles available in this category."),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      itemCount: _filteredVehicles.length,
                      itemBuilder: (context, index) {
                        final vehicle = _filteredVehicles[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 24),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(28),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.015),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // 1. Image and Floating Badges
                              Stack(
                                alignment: Alignment.center,
                                children: [
                                  // Circle Highlight directly on white card
                                  Container(
                                    width: double.infinity,
                                    height: 200,
                                    alignment: Alignment.center,
                                    child: Container(
                                      width: 170,
                                      height: 170,
                                      decoration: const BoxDecoration(
                                        color: Color(
                                          0xFFECE7FF,
                                        ), // Soft lavender highlight
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ),
                                  // Very Large Prominent Vehicle Image
                                  Positioned(
                                    child: Image.asset(
                                      vehicle["image"]!,
                                      height: 195,
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                  // Floating Heart Button (Top-Right)
                                  Positioned(
                                    top: 8,
                                    right: 8,
                                    child: GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          vehicle["isFavorite"] =
                                              !vehicle["isFavorite"];
                                        });
                                      },
                                      child: Container(
                                        height: 42,
                                        width: 42,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          shape: BoxShape.circle,
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.black.withOpacity(
                                                0.06,
                                              ),
                                              blurRadius: 4,
                                            ),
                                          ],
                                        ),
                                        child: Icon(
                                          vehicle["isFavorite"]
                                              ? Icons.favorite
                                              : Icons.favorite_border,
                                          color: vehicle["isFavorite"]
                                              ? Colors.red
                                              : Colors.grey.shade800,
                                          size: 20,
                                        ),
                                      ),
                                    ),
                                  ),
                                  // Floating Badge (Bottom-Left)
                                  Positioned(
                                    bottom: 8,
                                    left: 8,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF8FAF4),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: const Color(0xFFE2E8F0),
                                        ),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: const [
                                          Icon(
                                            Icons.bolt,
                                            color: Color(0xFF4313B8),
                                            size: 13,
                                          ),
                                          SizedBox(width: 4),
                                          Text(
                                            "100% Electric",
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Color(0xFF0F172A),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              // 2. Info Row (Title, Price & Action button)
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          vehicle["name"]!,
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF0F172A),
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          "${vehicle["price"]}/hr",
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w900,
                                            color: Color(0xFF4313B8),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // Action Button (Purple square with tilted arrow)
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              VehicleDetailsScreen(
                                                vehicleId: vehicle["id"]!,
                                                zone: "Vadodara Gotri Zone",
                                              ),
                                        ),
                                      );
                                    },
                                    child: Container(
                                      height: 48,
                                      width: 48,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF4313B8),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: const Icon(
                                        Icons.arrow_outward,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      // --- BOTTOM NAVIGATION BAR ---
      bottomNavigationBar: Container(
        height: 72,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildNavItem(0, Icons.home_outlined, Icons.home, "Home"),
              _buildNavItem(
                1,
                Icons.assignment_outlined,
                Icons.assignment,
                "Trips",
              ),
              _buildQrNavItem(),
              _buildNavItem(
                3,
                Icons.account_balance_wallet_outlined,
                Icons.account_balance_wallet,
                "Wallet",
              ),
              _buildNavItem(4, Icons.person_outline, Icons.person, "Profile"),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    int index,
    IconData outlineIcon,
    IconData filledIcon,
    String label,
  ) {
    // We default to "Home" tab being selected on the view all page mockup
    final bool isSelected = index == 0;
    final Color color = isSelected
        ? const Color(0xFF4313B8)
        : const Color(0xFF94A3B8);
    final IconData icon = isSelected ? filledIcon : outlineIcon;

    return Expanded(
      child: InkWell(
        onTap: () => _navigateToTab(index),
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQrNavItem() {
    return Expanded(
      child: InkWell(
        onTap: () => _navigateToTab(2),
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Transform.translate(
          offset: const Offset(0, -6),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFD2FC00), // Lime green
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD2FC00).withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(
                  Icons.qr_code_scanner_rounded, // QR code icon
                  color: Colors.black,
                  size: 22,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
