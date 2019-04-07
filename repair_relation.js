var mysql      = require('mysql');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//Konfigurasi koneksi MongoDB
mongoose.connect('mongodb://localhost:27017/katalog_dev'); //No password used to keep this example short
var mongodb = mongoose.connection;

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
	kode_kecamatan: String,
    kecamatanId: Schema.Types.ObjectId

});
var KecamatanSchema = new Schema({
	kode_kecamatan: String,
	nama_kecamatan: String,
	kode_kabupaten: String,
    kabupatenId: Schema.Types.ObjectId
});
var KabupatenSchema = new Schema({
	kode_kabupaten: String,
	nama_kabupaten: String,
	is_kota: Number,
	kode_provinsi: String,
    provinsiId: Schema.Types.ObjectId
});
var ProvinsiSchema = new Schema({
	kode_provinsi: String,
	nama_provinsi: String	
});
/*var Desa = mongoose.model('desa', DesaSchema);
var Kecamatan = mongoose.model('kecamatan', KecamatanSchema);
var Kabupaten = mongoose.model('kabupaten', KabupatenSchema);
var Provinsi = mongoose.model('provinsi', ProvinsiSchema);*/

var Desa = mongoose.model('Desa', DesaSchema, 'desa');
var Kecamatan = mongoose.model('Kecamatan', KecamatanSchema, 'kecamatan');
var Kabupaten = mongoose.model('Kabupaten', KabupatenSchema, 'kabupaten');
var Provinsi = mongoose.model('Provinsi', ProvinsiSchema, 'provinsi');

/*Provinsi.find({}, function(err, prov) {
// If errors exist console log them on terminal server-side
    if(err) {
        console.log("Error:", err);
    }
    else {
       console.log(prov);
    }
});*/

/*//Kabupaten
Kabupaten.find({}, function(err, kab) {
// If errors exist console log them on terminal server-side
    if(err) {
        console.log("Error:", err);
    }
    else {
       kab.forEach( k => {
        Provinsi.findOne({"kode_provinsi": k.kode_provinsi}, function(err, prov){
            //console.log(prov.nama_provinsi);
            k.provinsiId = prov._id;
            k.save();
            console.log(k.nama_kabupaten,' saved');
        });
       });
    }
});*/

/*
//Kecamatan
Kecamatan.find({}, function(err, kec) {
// If errors exist console log them on terminal server-side
    if(err) {
        console.log("Error:", err);
    }
    else {
       kec.forEach( k => {
        Kabupaten.findOne({"kode_kabupaten": k.kode_kabupaten}, function(err, kab){
            //console.log(prov.nama_provinsi);
            k.kabupatenId = kab._id;
            k.save();
            console.log(k.nama_kecamatan,' saved');
        });
       });
    }
});
*/

//Desa
Desa.find({}, function(err, des) {
// If errors exist console log them on terminal server-side
    if(err) {
        console.log("Error:", err);
    }
    else {
       des.forEach( k => {
        Kecamatan.findOne({"kode_kecamatan": k.kode_kecamatan}, function(err, kec){
            if(err) {
                console.log("Error:", err);
            }
            //console.log(k.nama_desa);
            k.kecamatanId = kec._id;
            k.save();
            console.log(k.nama_desa,' saved');
        });
       });
    }
});

console.log('------------- SELESAI -----------------');
