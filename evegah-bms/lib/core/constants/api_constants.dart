class ApiConstants {
  static String hostIp = '72.60.101.157'; // default IP address (Hostinger VPS)
  
  static String get baseUrl => 'http://$hostIp:5000/api';
  
  static const String batteriesEndpoint = '/batteries';
}
