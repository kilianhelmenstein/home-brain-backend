export default function(object: any): Buffer {
   return Buffer.from(JSON.stringify(object));
}