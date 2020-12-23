"""Paths to all the resources needed to calculate features. Also stores
the server options.

"""

MAX_CONTENT_LENGTH = 1024 * 1024

LM_KN = [
    "static/data/small_kn.bin"
]

LM_GT = [
    "static/data/small_gt.bin" 
]

SERVER_CONFIG = {
    "model": 'mse_multi',
    "model_folder": 'static/trained_models/',
    "language_model": LM_GT,
    "topk": 10
}

RESOURCES = {
    "lm_gt": LM_GT,
    "lm_kn": LM_KN,
    "wiki": "static/data/wiki_titles.txt",
    "urban": "static/data/urban_dict_words_A_Z.txt",
    "twitter": "static/data/twitter_counts.tsv",
    "google":  "static/data/google_counts.tsv",
}


def get_resources():
    return RESOURCES

def get_server_config():
    return SERVER_CONFIG

def get_max_content_length():
    return MAX_CONTENT_LENGTH