# wilayah2018-migrator
Migrate database wilayah MySQL ke MongoDB (restructured), Data wilayah digunakan pada laman http://data.infest.or.id

Kode ini memigrasikan database yang dimuat oleh https://github.com/cahyadsn/wilayah.

# Requirements
* Unduh SQL dari https://github.com/cahyadsn/wilayah/blob/master/wilayah_2018.sql
* Import ke database MySQL
* Environment MySQL, NodeJs, MongoDB

# Run

* $git clone https://github.com/infest-lab/wilayah2018-migrator.git
* $cd wilayah2018-migrator
* $nano index.js (sesuaikan konfigurasi database MySQL dan MongoDB)
* $npm install
* $node index.js

# Demo Penggunaan Data Wilayah
Visit: http://data.infest.or.id
