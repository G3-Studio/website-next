import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from "fs";
import path from "path";
import formidable, { File } from 'formidable';
import { v4 as uuidv4 } from "uuid";
import mv from "mv";

export const config = {
    api: {
      bodyParser: false,
    },
};
  
type ProcessedFiles = Array<[string, File]>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully', url: new Array<String>() };

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => {
            //
        });
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = {
            status: 'fail', 
            message: 'Upload error', 
            url: new Array<String>(),
        }
    });

    if (files?.length) {

        /* Create directory for uploads */
        let targetPath = path.join(process.cwd(), `/public/uploads/`);
        try {
            await fs.access(targetPath);
        } catch (e) {
            await fs.mkdir(targetPath);
        }

        /* Create directory for workshop */
        targetPath = path.join(process.cwd(), `/public/uploads/workshop/`);
        try {
            await fs.access(targetPath);
        } catch (e) {
            await fs.mkdir(targetPath);
        }

        /* Move uploaded files to directory */
        for (const file of files) {
            const tempPath = file[1].filepath;
            const targetFileName = uuidv4() + path.extname(file[1].originalFilename?.toString() || 'file.jpg');

            mv(tempPath, targetPath + targetFileName, async function(err) {
                if (err) {
                    console.log(err);
                    status = 500;
                    resultBody = {
                        status: 'fail', 
                        message: 'Upload error', 
                        url: new Array<String>(),
                    }
                }

                try {
                    await fs.chmod(targetPath + targetFileName, 0o755);
                } catch (e) {
                    console.log(e);
                    status = 500;
                    resultBody = {
                        status: 'fail', 
                        message: 'Upload error', 
                        url: new Array<String>(),
                    }
                }
            });
           
            resultBody.url.push('/uploads/workshop/' + targetFileName);
        }
    }

    res.status(status).json(resultBody);
}