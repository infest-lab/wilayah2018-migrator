var mysql      = require('mysql');
var mongoose = require('mongoose');

//Konfigurasi koneksi MySQL
var mysqldb = mysql.createConnection({
	connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    debug			: true,
    host     : 'localhost',
    database : 'MYSQL_DATABASE_NAME',
    user     : 'MYSQL_DATABASE_USER',
    password : 'MYSQL_DATABASE_PASSWORD',
});

//Konfigurasi koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/MONGODB_DATABASE_NAME'); //No password used to keep this example short
var mongodb = mongoose.connection;

//Test Koneksi MySQL
mysqldb.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('MySQL: Connected as id ' + mysqldb.threadId);
});

//Test Koneksi MongoDB
mongodb.on('error', console.error.bind(console, 'Connection error'));
mongodb.on('open', function(callback) {
	console.log('MongoDB: Connected to database.');
});

//Definisi Schema MongoDB
var Schema = mongoose.Schema;

var DesaSchema = new Schema({
	kode_desa: String,
	nama_desa: String,
	is_kelurahan: Number,
	kode_kecamatan: String
});
var KecamatanSchema = new Schema({
	kode_kecamatan: String,
	nama_kecamatan: String,
	kode_kabupaten: String
});
var KabupatenSchema = new Schema({
	kode_kabupaten: String,
	nama_kabupaten: String,
	is_kota: Number,
	kode_provinsi: String
});
var ProvinsiSchema = new Schema({
	kode_provinsi: String,
	nama_provinsi: String	
});
var Desa = mongoose.model('desa', DesaSchema);
var Kecamatan = mongoose.model('kecamatan', KecamatanSchema);
var Kabupaten = mongoose.model('kabupaten', KabupatenSchema);
var Provinsi = mongoose.model('provinsi', ProvinsiSchema);


//migrate provinsi
mysqldb.query('SELECT * FROM wilayah_2018 WHERE length(kode)=2 ORDER BY kode', function (error, results, fields) {
    if (error)
        throw error;

    results.forEach(result => {
    	var newProvinsi = Provinsi({
    		kode_provinsi: result.kode,
    		nama_provinsi: result.nama
    	});
    	newProvinsi.save();
        console.log(result.nama);
    });
});

//migrate kabupaten
mysqldb.query('SELECT * FROM wilayah_2018 WHERE length(kode)=5 ORDER BY kode', function (error, results, fields) {
    if (error)
        throw error;

    results.forEach(result => {
    	var nama = result.nama;
    	if(nama.substr(0,10)=='KAB. ADM. ') nama = nama.replace('KAB. ADM. ','');
    	else if(nama.substr(0,5)=='KAB. ') nama = nama.replace('KAB. ','');
    	var newKabupaten = Kabupaten({
    		kode_kabupaten: result.kode,
    		nama_kabupaten: nama,
    		is_kota:(result.kode.substr(3,1)==7) ? 1:0,
    		kode_provinsi:result.kode.substr(0,2)
    	});
    	newKabupaten.save();
        console.log(nama);
    });
});

//migrate kecamatan
mysqldb.query('SELECT * FROM wilayah_2018 WHERE length(kode)=8 ORDER BY kode', function (error, results, fields) {
    if (error)
        throw error;

    results.forEach(result => {
    	var newKecamatan = Kecamatan({
    		kode_kecamatan: result.kode,
    		nama_kecamatan: result.nama,
    		kode_kabupaten:result.kode.substr(0,5)
    	});
    	newKecamatan.save();
        console.log(result.nama);
    });
});

//migrate desa
mysqldb.query('SELECT * FROM wilayah_2018 WHERE length(kode)=13 ORDER BY kode', function (error, results, fields) {
    if (error)
        throw error;

    results.forEach(result => {
    	var newDesa = Desa({
    		kode_desa: result.kode,
    		nama_desa: result.nama,
    		is_kelurahan: (result.kode.substr(9,1)==2) ? 0:1,
    		kode_kecamatan:result.kode.substr(0,8)
    	});
    	newDesa.save();
        console.log(result.nama);
    });
});

//mysqldb.end();

console.log('SELESAI');