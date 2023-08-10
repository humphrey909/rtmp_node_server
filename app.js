const NodeMediaServer = require('node-media-server');
const { exec } = require('child_process');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

const fs = require('fs');

const config = {
    logType: 4,

    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        mediaroot: './',
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/local/bin/ffmpeg/ffmpeg',
        tasks: [
            {
                app: 'live',
                // vc: "copy",
                // vcParam: [],
                // ac: "aac",
                // acParam: ['-ab', '64k', '-ac', '1', '-ar', '44100'],

                // rtmp: true,
                // rtmpApp: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=0:hls_delete_threshold=10:hls_flags=delete_segments]',
                hlsKeep: true,
                // dash: true,
                // dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
                // dashKeep: true,

                customArgs: [
                    '-c:v libx264', // 비디오 코덱 설정
                    '-c:a libfdk_aac', // HE-AAC 오디오 코덱 설정
                    // '-c:a aac', // 오디오 코덱 설정

                    // '-b:v 4000k', // 비디오 비트레이트 설정 (예시: 1000k)
                    // '-b:a 128k', // 오디오 비트레이트 설정 (예시: 128k)
                    // '-vf "scale=1920:1080"', // 해상도 설정 (예시: 1920x1080)

                    '-b:v:0 4000k', // 비디오 비트레이트 설정 (예시: 4000k) - 가장 높은 비트레이트
                    '-b:v:1 2000k', // 비디오 비트레이트 설정 (예시: 2000k) - 중간 비트레이트
                    '-b:v:2 1000k', // 비디오 비트레이트 설정 (예시: 1000k) - 가장 낮은 비트레이트
                    '-b:a 128k', // 오디오 비트레이트 설정 (예시: 128k)
                    '-vf "scale=1920:1080"', // 해상도 설정 (예시: 1920x1080) - 가장 높은 해상도
                    '-vf "scale=1280:720"', // 해상도 설정 (예시: 1280x720) - 중간 해상도
                    '-vf "scale=640:360"', // 해상도 설정 (예시: 640x360) - 가장 낮은 해상도
                ],
                onTransExit: (app, args) => { // 안먹음.
                    // 트랜스코딩 작업이 완료된 후 실행될 로직을 작성합니다.
                    // 여기서 필요한 파일을 저장하면 됩니다.
                    console.log('트랜스코딩 작업이 완료되었습니다.');
                    console.log('저장할 파일:', args.output);
                    // 파일을 저장하는 로직을 작성하세요.
                    // fs.renameSync(args.output, './live/test_save');
                }
            }
        ]
    }
};

const nms = new NodeMediaServer(config);

nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
});
nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});
nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});


nms.on('prePublish', (id, StreamPath, args) => {
    // console.log('****1', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

    console.log('퍼블리시가 시작되었습니다.');
    // console.log('스트림 이름:', args.publishArgs);

    // console.log('저장할 파일:', args.publishArgs);
    // 파일을 저장하는 로직을 작성하세요.
    // fs.writeFileSync('./live/test_save', StreamPath);
    // args.receivedData.pipe(writeStream);

    // 저장할 파일의 경로를 생성합니다.
    // const streamFileName = `${args.publishArgs.name}.flv`;
    // const streamFilePath = `${baseFilePath}/${streamFileName}`;

    // const writeStream = fs.createWriteStream(streamFilePath);
    // args.receivedData.pipe(writeStream);


    // console.log("prePublish :" + StreamPath);
    // console.log("prePublish :" + id);
    // console.log(args);


    // // HLS 변환을 위해 ffmpeg 실행
    // const streamKey = StreamPath.split('/').pop(); // 스트림 키 추출
    // const outputDir = `./live/${streamKey}`;

    // console.log("*******");
    // console.log(streamKey);
    // console.log(outputDir);
    // console.log(`rtmp://43.201.165.228${StreamPath}`);
    // console.log("*******");

    // // //폴더 생성하기 
    // if (!fs.existsSync(outputDir)) { //없으면 생성
    //     fs.mkdirSync(outputDir);
    // }


    // const ffmpegCommand = `ffmpeg -i rtmp://localhost:1935${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 6 -hls_flags delete_segments -hls_segment_filename ${outputDir}/%03d.ts ${outputDir}/index.m3u8`;
    // const ffmpegCommand = `ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost${StreamPath}`;


    // const ffmpegCommand = `ffmpeg -i rtmp://43.201.165.228${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 6 -hls_flags delete_segments -hls_segment_filename ${outputDir}/%03d.ts ${outputDir}/index.m3u8`;
    // const ffmpegCommand = `ffmpeg -i rtmp://43.201.165.228${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments -hls_segment_filename ${outputDir}/%03d.ts ${outputDir}/index.m3u8`;
    // const ffmpegCommand = `ffmpeg -i rtmp://43.201.165.228${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 2 -hls_list_size 0 -hls_flags delete_segments -hls_segment_filename ./live/test_save/%03d.ts ./live/test_save/index.m3u8`;

    // const ffmpegCommand = `ffmpeg -i rtmp://43.201.165.228${StreamPath} -c:v libx264 -c:a aac -f hls -hls_time 2 -hls_list_size 0 -hls_flags delete_segments -hls_segment_filename ${outputDir}/%03d.ts ${outputDir}/index.m3u8`;


    //mp4 인코딩 시
    //ffmpeg -i sample-mp4-file.mp4 -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls index.m3u8


    // 압축해서 m3u8로 트랜스코딩 해주는 부분
    // exec(ffmpegCommand, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error('*****');

    //         console.error('FFmpeg execution error:', error);
    //         console.error('*****');
    //     } else {
    //         console.log('FFmpeg process started:', ffmpegCommand);
    //     }
    // });


    // ffmpeg.setFfmpegPath(ffmpegInstaller.path);

    // const rtmpUrl = `rtmp://43.201.165.228${StreamPath}`;  // 입력 RTMP URL
    // const hlsOutput = `http://43.201.165.228${outputDir}/stream.m3u8`;  // 출력 HLS URL

    // console.log("*******");
    // console.log(rtmpUrl);
    // console.log(hlsOutput);
    // console.log("*******");

    // const command = ffmpeg(rtmpUrl)
    //     // .inputOptions('-c:v copy')  // 비디오 스트림을 원본 포맷으로 유지합니다.
    //     // .inputOptions('-c:a copy')  // 오디오 스트림을 원본 포맷으로 유지합니다.
    //     .outputOptions('-c:v libx264')  // 비디오를 H.264로 인코딩합니다.
    //     .outputOptions('-c:a aac')  // 오디오를 AAC로 인코딩합니다.
    //     .outputOptions('-f hls')  // 출력 형식을 HLS로 설정합니다.
    //     .outputOptions('-hls_time 10')  // 각 세그먼트의 길이를 10초로 설정합니다.
    //     .outputOptions('-hls_list_size 6')  // 재생목록 크기를 6으로 설정합니다.
    //     .output(hlsOutput);

    // command.on('start', () => {
    //     console.log('트랜스코딩이 시작되었습니다.');
    // });
    // command.on('progress', (progress) => {
    //     console.log(`진행 중: ${progress.percent}%`);
    // });

    // command.on('end', () => {
    //     console.log('트랜스코딩이 완료되었습니다.');
    // });

    // command.on('error', (err) => {
    //     console.error('오류 발생:', err.message);
    //     console.error('오류 발생:', err);





    // });

    // command.run();



    // .on('end', () => {
    //     console.log('트랜스코딩이 완료되었습니다.');
    // })
    // .on('error', function (err, stdout, stderr) {
    //     if (err) {
    //         console.log(err.message);
    //         console.log("stdout:\n" + stdout);
    //         console.log("stderr:\n" + stderr);
    //         reject("Error");
    //     }
    // })
    // .run();


});
nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
    // console.log("donePublish");

    // console.log('****2', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // 퍼블리시 완료 후 추가 작업을 수행할 수 있습니다.
});
nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});
nms.run();
