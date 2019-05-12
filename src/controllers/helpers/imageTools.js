async function compressImages(files) {
  const aTime = Date.now();
  const fileName = `${aTime}.zip`;

  const dirs = [
    'úploads',
    'uploads/compressed_raw_images',
    'uploads/temp_raw_images',
  ];

  await createDirsIfNotExist(dirs);

  const output = fs.createWriteStream(`uploads/compressed_raw_images/${aTime}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  output.on('end', function() { 
    console.log('Data has been drained');
  });
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });
  archive.on('error', function(err) {
    throw err;
  });
  archive.pipe(output);
  
  for (let file of files) {
    var file1 = `./uploads/temp_raw_images/${file.filename}`;
    archive.append(fs.createReadStream(file1), { name: `${file.filename}.jpg` });
  }

  archive.finalize();
  return fileName;
}

async function createDirsIfNotExist(dirs) {
  for (dir of dirs) {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  }
  return true;
}

module.exports = {
  compressImages,
}