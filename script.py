import sys

import requests
import pymongo

from datetime import datetime
from dateutil import parser
from bs4 import BeautifulSoup
from selenium import webdriver


def extract_month_files_meta_data(url, collection):
    # setup chrome options
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('window-size=1920x1080')

    # setup driver
    chrome_path = "./chromedriver"
    driver = webdriver.Chrome(executable_path=chrome_path, options=options)

    # wait for month webpage to fully load
    driver.get(url)
    driver.implicitly_wait(3)

    response = driver.page_source
    soup = BeautifulSoup(response, "html.parser")
    table = soup.table

    for a_tag in table.findAll('a'):
        try:
            product_id = a_tag['href'].split("/")[-1]
            link = f"https://sys.archives.gov.il/api/solr?rows=1&fq[]=product_code_s:{product_id}&fq[]=lang_code_s:he"
            read_archive_file(link, collection)
        except Exception:
            print("Could not open url")

    driver.close()


def read_archive_file(url, collection):
    data_dict = read_meta_data(url)[0]
    extract_meta_data(data_dict, collection)


def read_meta_data(url):
    metadata = requests.get(url).json()
    return metadata["response"]["docs"]


# load the meta data to mongoDB
def extract_meta_data(data_dict, collection):
    if data_dict is None:
        return
    link = f"https://www.archives.gov.il/archives/Archive/{data_dict['objHier_archiveId_s']}/File/{data_dict['product_code_s']}"
    print(f"link = {link}")
    meta_data = {
        'גופים': data_dict.get('objHier_archiveName_s', None),
        'סטטוס חשיפה': data_dict.get('addAttr_statusChasifa_t', None),
        'מספר תיק ישן': data_dict.get('addAttr_tikOldNumber_t', None),
        'מיקום גוף יוצר': data_dict.get('addAttr_orgTree_t', None),
        'סוג התיק': data_dict.get('objAttr_materialType_t', None),
        'אישים': data_dict.get('person_s', None),
        'נושאים': data_dict.get('subject_s', None),
        'תיאור': data_dict.get('objDesc_objectDesc_t', None),
        'תקופת החומר מ': to_date(data_dict.get('objDate_datingPeriodStart_s', None)),
        'תקופת החומר עד': to_date(data_dict.get('objDate_datingPeriodEnd_s', None)),
        'מספר תיק לציטוט': data_dict.get('objHier_objectReference_s', None),
        'כותרת': data_dict.get('objDesc_objectName_t', None),
        'קישור': link
    }
    collection.insert_one(meta_data)


def to_date(date_str):
    if date_str is None:
        return None
    return parser.parse(str(datetime.strptime(date_str, '%d/%m/%Y')))


def get_database():
    CONNECTION_STRING = "mongodb+srv://Digital:igaleyaelgeis@cluster0.qofyt.mongodb.net/Recently-Uploaded-Files?retryWrites=true&w=majority"
    client = pymongo.MongoClient(CONNECTION_STRING)
    return client['Recently-Uploaded-Files']


def get_collection_name(url):
    collection_name = ""
    suffix = url.split('/')[-1].lower()

    months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    for i in range(12):
        if months[i] in suffix:
            collection_name = str(i+1)
            break

    years = ['2019', '2020', '2021', '2022', '2023']
    for year in years:
        if year in suffix:
            collection_name = collection_name + "-" + year
            break

    return collection_name


def main(url):
    if url.endswith("/"):
        url = url[:-1]
    db_name = get_database()
    collection = db_name[get_collection_name(url)]
    extract_month_files_meta_data(url, collection)


if __name__ == '__main__':
    main(sys.argv[1])
