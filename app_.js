const NodeMediaServer = require('node-media-server');
const { exec } = require('child_process');
// const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const config = {
    logType: 3,

    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        mediaroot: './live',
        allow_origin: '*'
    }
};

const nms = new NodeMediaServer(config);




nms.on('prePublish', (id, StreamPath, args) => {
    // console.log('****1', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

    console.log("prePublish :" + StreamPath);
    console.log("prePublish :" + id);
    console.log(args);


    // HLS 변환을 위해 ffmpeg 실행
    const streamKey = StreamPath.split('/').pop(); // 스트림 키 추출
    const outputDir = `./live/${streamKey}`;

    console.log("*******");
    console.log(streamKey);
    console.log(outputDir);
    console.log(`rtmp://localhost${StreamPath}`);
    console.log("*******");

    //폴더 생성하기 
    if (!fs.existsSync(outputDir)) { //없으면 생성
        fs.mkdirSync(outputDir);
    }


    // const ffmpegCommand = `ffmpeg -i rtmp://localhost:1935${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 6 -hls_flags delete_segments -hls_segment_filename ${outputDir}/%03d.ts ${outputDir}/index.m3u8`;
    // const ffmpegCommand = `ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost${StreamPath}`;
    const ffmpegCommand = `ffmpeg -i rtmp://localhost${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 6 -hls_flags delete_segments -hls_segment_filename ${outputDir}/%03d.ts ${outputDir}/index.m3u8`;

    //mp4 인코딩 시
    //ffmpeg -i sample-mp4-file.mp4 -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls index.m3u8


    //압축해서 m3u8로 트랜스코딩 해주는 부분
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('FFmpeg execution error:', error);
        } else {
            console.log('FFmpeg process started:', ffmpegCommand);
        }
    });
});

nms.on('donePublish', (id, StreamPath, args) => {
    // console.log("donePublish");

    // console.log('****2', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // 퍼블리시 완료 후 추가 작업을 수행할 수 있습니다.
});

nms.run();
