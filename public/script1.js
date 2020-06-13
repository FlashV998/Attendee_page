const domain = 'meet.jit.si';
const options = {
    roomName: 'welcometoinvid',
    width: 1060,
    height: 615,
    parentNode: document.querySelector('#meet')
};
const api = new JitsiMeetExternalAPI(domain, options);