import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

class SelectLocationScreen extends StatefulWidget {
  final String currentCity;
  final Function(String) onLocationSelected;

  const SelectLocationScreen({
    super.key,
    required this.currentCity,
    required this.onLocationSelected,
  });

  @override
  State<SelectLocationScreen> createState() => _SelectLocationScreenState();
}

class _SelectLocationScreenState extends State<SelectLocationScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, String>> _filteredCities = [];
  bool _isLocating = false;

  final List<Map<String, String>> _popularCities = [
    {
      "name": "Vadodara",
      "image": "https://images.unsplash.com/photo-1626248801379-51a07b62f4bc?w=400&fit=crop&q=80",
    },
    {
      "name": "Daman",
      "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&fit=crop&q=80",
    },
    {
      "name": "Delhi NCR",
      "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&fit=crop&q=80",
    },
    {
      "name": "Bangalore",
      "image": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&fit=crop&q=80",
    },
    {
      "name": "Mumbai",
      "image": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&fit=crop&q=80",
    },
    {
      "name": "Hyderabad",
      "image": "https://images.unsplash.com/photo-1608958214878-43d9cc2c7001?w=400&fit=crop&q=80",
    },
    {
      "name": "Ahmedabad",
      "image": "https://images.unsplash.com/photo-1603258845076-a17c9066f27f?w=400&fit=crop&q=80",
    },
    {
      "name": "Chennai",
      "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&fit=crop&q=80",
    },
  ];

  @override
  void initState() {
    super.initState();
    _filteredCities = List.from(_popularCities);
  }

  void _filterCities(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredCities = List.from(_popularCities);
      } else {
        _filteredCities = _popularCities
            .where((city) =>
                city["name"]!.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isLocating = true;
    });

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw 'Location services are disabled.';
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw 'Location permissions are denied.';
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw 'Location permissions are permanently denied.';
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.low,
        timeLimit: const Duration(seconds: 5),
      );

      String detectedCity = "Vadodara";
      double vDist = Geolocator.distanceBetween(position.latitude, position.longitude, 22.3072, 73.1812);
      double bDist = Geolocator.distanceBetween(position.latitude, position.longitude, 12.9716, 77.5946);

      if (bDist < vDist) {
        detectedCity = "Bangalore";
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Located: $detectedCity"),
          backgroundColor: const Color(0xFF4313B8), // Brand purple
        ),
      );

      widget.onLocationSelected(detectedCity);
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.redAccent,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLocating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Please select your location",
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              // Search Input
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: _filterCities,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search_rounded, color: Colors.grey),
                    hintText: "Search your city",
                    hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFF4313B8), width: 1), // Brand purple
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Location Card Illustration
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    // Stylized Map Drawing
                    Container(
                      height: 130,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Grid Map Lines
                          CustomPaint(
                            size: const Size(double.infinity, 130),
                            painter: _MapGridPainter(),
                          ),
                          // Target Area Circle
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              color: const Color(0xFF4313B8).withOpacity(0.06), // Brand purple tint
                              shape: BoxShape.circle,
                            ),
                          ),
                          Container(
                            width: 70,
                            height: 70,
                            decoration: BoxDecoration(
                              color: const Color(0xFF4313B8).withOpacity(0.1), // Brand purple tint
                              shape: BoxShape.circle,
                            ),
                          ),
                          // Location Pin
                          Positioned(
                            top: 25,
                            left: 85,
                            child: const Icon(
                              Icons.location_on_rounded,
                              color: Color(0xFF4313B8), // Brand purple pin
                              size: 26,
                            ),
                          ),
                          // EV scooter image from assets
                          Positioned(
                            bottom: 20,
                            child: Image.asset(
                              "assets/mink.png",
                              height: 70,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) =>
                                  const Icon(Icons.electric_scooter_rounded,
                                      size: 50, color: Color(0xFF4313B8)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      "Find the perfect EV right around the corner",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      "For best experience, click 'always allow location' on your device. Your data is safe with us.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Use Current Location Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _isLocating ? null : _getCurrentLocation,
                  icon: _isLocating
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.my_location_rounded, size: 18),
                  label: Text(
                    _isLocating ? "Locating..." : "Use your current location",
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4313B8), // Brand purple button
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // POPULAR CITIES Grid
              const Text(
                "POPULAR CITIES",
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 14),

              _filteredCities.isEmpty
                  ? const Padding(
                      padding: EdgeInsets.symmetric(vertical: 20.0),
                      child: Center(
                        child: Text(
                          "No cities found",
                          style: TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                      ),
                    )
                  : GridView.builder(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 20,
                        childAspectRatio: 0.82,
                      ),
                      itemCount: _filteredCities.length,
                      itemBuilder: (context, index) {
                        final city = _filteredCities[index];
                        final isCurrent = widget.currentCity == city["name"];

                        return GestureDetector(
                          onTap: () {
                            widget.onLocationSelected(city["name"]!);
                            Navigator.pop(context);
                          },
                          child: Column(
                            children: [
                              // City Circle Image
                              Container(
                                width: 75,
                                height: 75,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isCurrent
                                        ? const Color(0xFF4313B8)
                                        : Colors.grey.shade200,
                                    width: isCurrent ? 2 : 1,
                                  ),
                                ),
                                child: ClipOval(
                                  child: Image.network(
                                    city["image"]!,
                                    fit: BoxFit.cover,
                                    loadingBuilder: (context, child, progress) {
                                      if (progress == null) return child;
                                      return Container(
                                        color: const Color(0xFFF1F5F9),
                                        alignment: Alignment.center,
                                        child: const SizedBox(
                                          width: 16,
                                          height: 16,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 1.5,
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                                    Colors.grey),
                                          ),
                                        ),
                                      );
                                    },
                                    errorBuilder: (context, error, stack) =>
                                        Container(
                                      color: const Color(0xFFF1F5F9),
                                      child: const Icon(
                                        Icons.location_city_rounded,
                                        color: Colors.grey,
                                        size: 28,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              // City Name
                              Text(
                                city["name"]!,
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isCurrent
                                      ? FontWeight.bold
                                      : FontWeight.w500,
                                  color: isCurrent
                                      ? const Color(0xFF4313B8)
                                      : const Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 2.0;

    canvas.drawLine(
        Offset(0, size.height * 0.4), Offset(size.width, size.height * 0.45), paint);
    canvas.drawLine(
        Offset(0, size.height * 0.75), Offset(size.width, size.height * 0.7), paint);

    canvas.drawLine(
        Offset(size.width * 0.3, 0), Offset(size.width * 0.35, size.height), paint);
    canvas.drawLine(
        Offset(size.width * 0.75, 0), Offset(size.width * 0.7, size.height), paint);

    canvas.drawLine(
        Offset(0, size.height * 0.1), Offset(size.width, size.height * 0.9), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
