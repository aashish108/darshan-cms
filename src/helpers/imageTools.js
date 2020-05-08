// archiver
const fs = require('fs');
const archiver = require('archiver');

const dirs = [
  'uploads',
  'uploads/compressed_raw_images',
  'uploads/temp_raw_images',
];

async function createDirsIfNotExist() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  return true;
}

async function compressImages(files) {
  const aTime = Date.now();
  const fileName = `${aTime}.zip`;

  await createDirsIfNotExist(dirs);

  const output = fs.createWriteStream(`uploads/compressed_raw_images/${aTime}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  output.on('end', () => {
    console.log('Data has been drained');
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      // log warning
      throw err;
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  for (const file of files) {
    const file1 = `uploads/temp_raw_images/${file.filename}`;

    archive.append(
      fs.createReadStream(file1),
      { name: `${file.filename}.jpg` },
    );
  }
  archive.finalize();

  return fileName;
}

module.exports = {
  compressImages,
};
